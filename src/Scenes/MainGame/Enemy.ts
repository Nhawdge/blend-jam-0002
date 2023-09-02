import * as PIXI from 'pixi.js';
import consts from '../../constants';

export type IEnemyInfo = {
    speed: number,
    sheet: number,
    spawnRate: number,
    minTimeToSpawn: number,
    ringRadius: number,
    ringRadiusSquared: number,
    trackId: number,
    animations: {
        idle: number
    }
}

import { addComponent, defineComponent, defineQuery, defineSystem, IWorld, removeComponent, removeEntity, Types } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity, initComponent, updateEntity } from "../../Components/ComponentInitializer";
import DeltaTime from "../../Resources/DeltaTime";
import Position, { addPosition } from '../../Components/Position';
import Vec2 from '../../Utils/Vec2';
import Events from '../../Events/Events';
import Velocity, { addVelocity } from '../../Components/Velocity';
import ToneTiming from '../../Resources/ToneTiming';
import { addSprite } from '../../Components/Spite';

const ENEMIES: IEnemyInfo[] = [];

const Enemy = defineComponent({
    type: Types.ui8, // Index into IEnemyInfo
    state: Types.ui8, // 1 == Wandering, 0 = idle
    time: Types.f32, // How long remaining in this state
    time2: Types.f32, // How long original supposed to be in this state (only used when wandering)
    destX: Types.f32, // Destination location
    destY: Types.f32,
    startX: Types.f32,
    startY: Types.f32,
    InCollision: Types.ui8,
    DistanceToCenter: Types.f32,
});

// This is an enemy who has been hit and is flying away from the character
const EnemyAfterHit = defineComponent({
    type: Types.ui8, // Index into IEnemyInfo
})

function addEnemyAfterHit(enemy:number): initComponent {
    return (world, entity) => {
        addComponent(world, EnemyAfterHit, entity);
        EnemyAfterHit.type[entity] = enemy;
    };
}

function addEnemy(enemy: number, x: number, y: number): initComponent {
    return (world, entity) => {
        addComponent(world, Enemy, entity);
        Enemy.type[entity] = enemy;
        Enemy.state[entity] = 0;
        Enemy.time[entity] = 1000;
        Enemy.time2[entity] = 1000;
        Enemy.destX[entity] = 0;
        Enemy.destY[entity] = 0;
        Enemy.startX[entity] = x;
        Enemy.startY[entity] = y;
        Enemy.InCollision[entity] = 0;

        var center = new Vec2(400, 400);

        Enemy.DistanceToCenter[entity] = center.sub(new Vec2(x, y)).length();
    };
}

let totalEnemies = 0;

export function spawnEnemiesSystem() {
    let nextSpawn = 5000;
    let totalTime = 0;
    var center = new Vec2(400, 400);

    return defineSystem((world) => {
        const delta = DeltaTime.get();

        nextSpawn = nextSpawn - delta;
        totalTime += delta;

        if (nextSpawn < 0 && totalEnemies < consts.MAX_ENEMIES_ON_SCREEN) {
            let availableSpawns = ENEMIES.filter(x => x.minTimeToSpawn < totalTime)
                .map((v, i) => ({ weight: v.spawnRate, index: i }));

            // TODO: Weighted choice
            /*
            let totalWeight = availableSpawns.reduce((agg, v) => v.weight + agg, 0);
            let choice = Math.floor(Math.random() * totalWeight);
            let result = availableSpawns.find(x => x.weight >= choice);
            if (!result)
                result = availableSpawns[availableSpawns.length - 1];
            */

            const choice = Math.floor(Math.random() * availableSpawns.length);
            const result = availableSpawns[choice];
            const enemyInfo = ENEMIES[result.index];

            const x = (Math.random() * consts.SPAWN_SIZE) - (consts.SPAWN_SIZE / 2);
            const y = (Math.random() * consts.SPAWN_SIZE) - (consts.SPAWN_SIZE / 2);

            composeEntity(world, [
                addEnemy(result.index, x, y),
                addAnimatedSprite(
                    enemyInfo.sheet,
                    enemyInfo.animations.idle
                ),
                addPosition(x, y)
            ]);

            nextSpawn = (Math.random() * 2000) + 1000;

            totalEnemies += 1;
        }

        return world;
    });
}

export function commenceToJigglin() {

    const enemyQuery = defineQuery([Enemy, Position]);

    return defineSystem((world) => {
        var center = new Vec2(400, 400);
        const delta = DeltaTime.get();

        for (let entity of enemyQuery(world)) {
            Enemy.time[entity] -= delta;
            const enemyInfo = ENEMIES[Enemy.type[entity]];
            const state = Enemy.state[entity];
            const pos = new Vec2(Position.x[entity], Position.y[entity]);

            if (Enemy.time[entity] < 0) {
                const newState = state == 1 ? 0 : 1;
                Enemy.startX[entity] = Position.x[entity];
                Enemy.startY[entity] = Position.y[entity];

                if (newState == 1) {
                    let offset = new Vec2(
                        50 - (Math.random() * 100 * enemyInfo.speed),
                        50 - (Math.random() * 100 * enemyInfo.speed)
                    );

                    // TODO: Is this position in range? If not, regenerate.
                    let newPosition = pos.add(offset);
                    Enemy.destX[entity] = newPosition.x;
                    Enemy.destY[entity] = newPosition.y;

                    Enemy.DistanceToCenter[entity] = center.sub(newPosition).length();
                    Enemy.InCollision[entity] = Enemy.DistanceToCenter[entity] > consts.RING_1_RADIUS && Enemy.DistanceToCenter[entity] < consts.RING_5_RADIUS ? 1 : 0;
                }

                const newTime = (Math.random() * 5000) + 2000;
                Enemy.state[entity] = newState;
                Enemy.time[entity] = newTime
                Enemy.time2[entity] = newTime;

                continue;
            }

            if (state === 1) {
                const dest = new Vec2(Enemy.destX[entity], Enemy.destY[entity]);
                const start = new Vec2(Enemy.startX[entity], Enemy.startY[entity]);
                const progress = (Enemy.time2[entity] - Enemy.time[entity]) / Enemy.time2[entity];
                const diff = dest.sub(start).timesScalar(progress).add(start);
                Position.x[entity] = diff.x;
                Position.y[entity] = diff.y;
            }
        }

        return world;
    })
}

export function handleAxeHitEvents() {
    return defineSystem((world) => {
        for (const hit of Events.axeHits.read()) {

            const playerToEnemy = hit.enemyPosition.sub(hit.playerPosition).normalize();
            const velocity = playerToEnemy.timesScalar(4);
            const enemyType = Enemy.type[hit.enemy];

            removeComponent(world, Enemy, hit.enemy);
            updateEntity(world, hit.enemy, [
                addVelocity(velocity.x, velocity.y),
                addEnemyAfterHit(enemyType)
            ]);

        }


        return world;
    });
}

export function applyDragToHitEnemies() {
    const enemyQuery = defineQuery([EnemyAfterHit, Velocity, Position]);

    return defineSystem((world) => {
        for (const enemy of enemyQuery(world)) {
            Velocity.x[enemy] *= 0.95;
            Velocity.y[enemy] *= 0.95;

            const stalled = Math.abs(Velocity.x[enemy]) < 0.01 && Math.abs(Velocity.y[enemy]) < 0.01;
            if (stalled) {
                const type = EnemyAfterHit.type[enemy];
                removeComponent(world, EnemyAfterHit, enemy);
                updateEntity(world, enemy, [
                    addEnemy(
                        type,
                        Position.x[enemy],
                        Position.y[enemy]
                    )
                ]);
            }
        }

        return world;
    });
}

export function detectHitRing(noteTexture:number) {
    const hitEnemyQuery = defineQuery([EnemyAfterHit, Position]);
    const center = new Vec2(0, 0);

    return defineSystem((world) => {
        for (const enemy of hitEnemyQuery(world)) {
            const rayFromCenter = new Vec2(Position.x[enemy], Position.y[enemy]);
            const distFromCenter = rayFromCenter.squareLen();

            const enemyInfo = ENEMIES[EnemyAfterHit.type[enemy]];
            if (distFromCenter > enemyInfo.ringRadiusSquared) {
                const beat = ToneTiming.getPlaceInSong(rayFromCenter);
                const newPlace = ToneTiming.getPlaceOnRing(beat, enemyInfo.ringRadius);
                ToneTiming.loop.addNote(enemyInfo.trackId, beat, 'C');

                composeEntity(world, [
                    addSprite(noteTexture),
                    addPosition(newPlace.x, newPlace.y),
                ]);

                removeEntity(world, enemy);
                totalEnemies -= 1;
            }
        }

        return world;
    })
}

export default {
    ENEMIES,
    Enemy
};

