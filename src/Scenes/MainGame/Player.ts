import { addComponent, defineComponent, defineQuery, defineSystem, IWorld, removeEntity, Types } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity, include, initComponent } from "../../Components/ComponentInitializer";
import Position, { addPosition } from "../../Components/Position";
import Velocity, { addVelocity } from "../../Components/Velocity";
import keys from '../../Resources/KeysResource';
import Vec2 from "../../Utils/Vec2";
import consts from '../../constants';
import DeltaTime from "../../Resources/DeltaTime";
import Sprite, { addSprite } from "../../Components/Spite";
import Enemy from '../MainGame/Enemy';
import Events from "../../Events/Events";

const PlayerAnimations = {
    Idle: 0
};

const RADIANS_CONVERSION = 180 / Math.PI;

export default PlayerAnimations;

// Player component
const Player = defineComponent({
    isAttacking: Types.ui8,
    attackTime: Types.f32
});

const Axe = defineComponent({
    time: Types.f32,
    attackTime: Types.f32
});

function addAxe(time: number) : initComponent {
    return (world, entity) => {
        addComponent(world, Axe, entity);
        Axe.attackTime[entity] = time;
        Axe.time[entity] = 0;
    };
}

export function spawnPlayer(world:IWorld, playerSheet:number) {
    composeEntity(
        world,
        [
            addPosition(0, 0),
            addVelocity(0, 0),
            addAnimatedSprite(playerSheet, PlayerAnimations.Idle),
            include(Player)
        ]
    );
}


export function playerMovementSystem() {

    const playerQuery = defineQuery([Player, Velocity]);
 
    return defineSystem((world) => {
        const player = playerQuery(world).find(x => true);
        if (!player) { return world; }

        let velocityAdjustment = new Vec2(0, 0);

        if (keys.isKeyDown('a') || keys.isKeyDown('ArrowLeft'))
            velocityAdjustment.x -= consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('d') || keys.isKeyDown('ArrowRight'))
            velocityAdjustment.x += consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('w') || keys.isKeyDown('ArrowUp'))
            velocityAdjustment.y -= consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('s') || keys.isKeyDown('ArrowDown'))
            velocityAdjustment.y += consts.PLAYER_ACCELERATION;

        let newVelocity = new Vec2(
            Velocity.x[player],
            Velocity.y[player]
        );
        if (velocityAdjustment.x === 0 && velocityAdjustment.y === 0) {
            newVelocity = newVelocity.timesScalar(consts.PLAYER_DRAG);
        } else {
            newVelocity = newVelocity.add(velocityAdjustment);
        }

        newVelocity = newVelocity
            .clamp(consts.MAX_PLAYER_SPEED, consts.MAX_PLAYER_SPEED);

        Velocity.x[player] = newVelocity.x;
        Velocity.y[player] = newVelocity.y;

        return world;
    })
}


export function playerAttackSystem(spriteTexture:number) {
    const playerQuery = defineQuery([Player, Velocity, Position]);
 
    return defineSystem((world) => {
        const player = playerQuery(world).find(x => true);
        if (!player) { return world; }

        const isAttacking = Player.isAttacking[player] != 0;
        const delta = DeltaTime.get();
        if (isAttacking) {
            Player.attackTime[player] += delta;
            if (Player.attackTime[player] > consts.SWIPE_TIME) {
                Player.isAttacking[player] = 0;
            }
        } else {
            if (keys.keyJustReleased(' ')) {
                Player.isAttacking[player] = 1;
                Player.attackTime[player] = 0;

                composeEntity(world, [
                    addSprite(spriteTexture),
                    addPosition(Position.x[player], Position.y[player] - 5),
                    addAxe(consts.SWIPE_TIME)
                ]);

            }
        }




        return world;
    });
}

export function spinAxeSystem() {
    const playerQuery = defineQuery([Player, Position]);
    const axeQuery = defineQuery([Position, Axe, Sprite]);

    return defineSystem((world) => {
        const delta = DeltaTime.get();
        const player = playerQuery(world).find(x => true);
        if (!player) { return world; }

        for (const axe of axeQuery(world)) {
            const time = Axe.time[axe] + delta;
            const duration = time / Axe.attackTime[axe];

            if (duration > 1) {
                removeEntity(world, axe);
                continue;
            }

            const radians = duration * 2 * Math.PI;

            var newX = Math.cos(radians) * consts.SWIPE_RADIUS;
            var newY = Math.sin(radians) * consts.SWIPE_RADIUS;
            
            Sprite.angle[axe] = radians * RADIANS_CONVERSION;
            Position.x[axe] = newX + Position.x[player];
            Position.y[axe] = newY + Position.y[player];
            Axe.time[axe] = time;
        }

        return world;
    });
}

export type AxeHitEvent = {
    axe: number,
    playerPosition: Vec2,
    enemy: number,
    enemyPosition: Vec2
};

export function checkForAxeCollision() {
    const axeQuery = defineQuery([Axe, Position]);
    const enemyQuery = defineQuery([Enemy.Enemy, Position]);
    const playerQuery = defineQuery([Player, Position]);

    const axeSizeCheck = new Vec2(16, 16);
    const axeDistanceSquared = axeSizeCheck.squareLen();

    return defineSystem((world) => {
        const player = playerQuery(world).find(x => true);
        if (!player) { return world; }

        for (const axe of axeQuery(world)) {
            const axePosition = new Vec2(Position.x[axe], Position.y[axe]);

            for (const enemy of enemyQuery(world)) {
                const enemyPosition = new Vec2(Position.x[enemy], Position.y[enemy]);
                const dist = axePosition.sub(enemyPosition).squareLen();

                if (dist < axeDistanceSquared) {
                    Events.axeHits.push({
                        axe: axe,
                        playerPosition: new Vec2(Position.x[player], Position.y[player]),
                        enemy: enemy,
                        enemyPosition: enemyPosition
                    });
                }
            }
        }

        return world;
    })
}
