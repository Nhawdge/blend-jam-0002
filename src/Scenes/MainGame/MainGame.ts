import * as PIXI from 'pixi.js';
import { composeEntity, include } from '../../Components/ComponentInitializer';
import { addPosition } from '../../Components/Position';
import { addSprite } from '../../Components/Spite';
import createResourceMap from "../../IResourceMap";
import { despawnAnimatedSprites, spawnAnimatedSprites, updateAnimatedSprites } from '../../Systems/AnimatedSpriteSystem';
import { simplifiedPhysics } from '../../Systems/PhysicsSystems';
import { despawnSprites, spawnSprites, updateSprites } from '../../Systems/SpriteSystem';
import { loadAseprite } from '../../Utils/AsepriteUtilities';
import IGameContext from '../GameContext';
import { addHoc, SceneBuilder } from "../SceneManager";
import PlayerAnimations, { checkForAxeCollision, playerAttackSystem, playerMovementSystem, spawnPlayer, spinAxeSystem } from './Player';
import { needleMovementSystem, spawnNeedle } from './Needle';
import Enemy, { applyDragToHitEnemies, commenceToJigglin, detectHitRing, handleAxeHitEvents, IEnemyInfo, spawnEnemiesSystem } from './Enemy';
import constants from '../../constants';
import ToneTiming from '../../Resources/ToneTiming';


export default async function mainGameScene() : Promise<SceneBuilder> {
    const textures = createResourceMap<PIXI.Texture>();
    const bg = textures.add(await PIXI.Assets.load('assets/prototype-level.png') as PIXI.Texture);
    const needleTexture = textures.add(await PIXI.Assets.load('assets/needle.png') as PIXI.Texture);
    const axeTexture = textures.add(await PIXI.Assets.load('assets/player/pickaxe.png') as PIXI.Texture);
    const noteTexture = textures.add(await PIXI.Assets.load('assets/enviroment/note.png') as PIXI.Texture);

    const sheets = createResourceMap<PIXI.Spritesheet>();
    const animations = createResourceMap<string>();
    const playerSheet = sheets.add(await loadAseprite('assets/player/player.png', 'assets/player/player.json', 'player:'));

    // Define enemies
    const pebble:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/pebble.png', 'assets/enemy/pebble.json', 'pebble:')),
        speed: 1,
        minTimeToSpawn: 5,
        spawnRate: 1,
        ringRadius: constants.RING_1_RADIUS,
        ringRadiusSquared: constants.RING_1_RADIUS * constants.RING_1_RADIUS,
        trackId: 3,
        animations: {
            idle: animations.add('pebble:idle')
        }
    };
    Enemy.ENEMIES.push(pebble);

    const rock:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/rock.png', 'assets/enemy/rock.json', 'rock:')),
        speed: 1,
        minTimeToSpawn: 5,
        spawnRate: 1,
        ringRadius: constants.RING_2_RADIUS,
        ringRadiusSquared: constants.RING_2_RADIUS * constants.RING_2_RADIUS,
        trackId: 2,
        animations: {
            idle: animations.add('rock:idle')
        }
    };
    Enemy.ENEMIES.push(rock);

    const boulder:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/boulder.png', 'assets/enemy/boulder.json', 'boulder:')),
        speed: 1,
        minTimeToSpawn: 5,
        spawnRate: 1,
        ringRadius: constants.RING_3_RADIUS,
        ringRadiusSquared: constants.RING_3_RADIUS * constants.RING_3_RADIUS,
        trackId: 0,
        animations: {
            idle: animations.add('boulder:idle')
        }
    };
    Enemy.ENEMIES.push(boulder);

    // const chord:IEnemyInfo = {
    //     sheet: sheets.add(await loadAseprite('assets/enemy/chord-enemy.png', 'assets/enemy/chord-enemy.json', 'lead:')),
    //     speed: 1,
    //     minTimeToSpawn: 5,
    //     spawnRate: 1,
    //     animations: {
    //         idle: animations.add('lead:idle')
    //     }
    // };
    // ENEMIES.push(chord);

    // const lead:IEnemyInfo = {
    //     sheet: sheets.add(await loadAseprite('assets/enemy/lead-enemy.png', 'assets/enemy/lead-enemy.json', 'chord:')),
    //     speed: 1,
    //     minTimeToSpawn: 3,
    //     spawnRate: 1,
    //     animations: {
    //         idle: animations.add('chord:idle')
    //     }
    // };
    // ENEMIES.push(lead);

    const snare:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/snare-enemy.png', 'assets/enemy/snare-enemy.json', 'snare:')),
        speed: 1,
        minTimeToSpawn: 3,
        spawnRate: 1,
        ringRadius: constants.RING_4_RADIUS,
        ringRadiusSquared: constants.RING_4_RADIUS * constants.RING_4_RADIUS,
        trackId: 1,
        animations: {
            idle: animations.add('snare:idle')
        }
    };
    Enemy.ENEMIES.push(snare);

    PlayerAnimations.Idle = animations.add('player:idle');

    return ({ world, container }: IGameContext) => {
        composeEntity(
            world,
            [
                addPosition(0, 0),
                addSprite(bg)
            ]
        );

        spawnPlayer(world, playerSheet);
        spawnNeedle(world, needleTexture);

        ToneTiming.reset();

        return [
            spawnSprites(textures, container),
            spawnAnimatedSprites(sheets, animations, container),
            detectHitRing(noteTexture),

            playerMovementSystem(),
            playerAttackSystem(axeTexture),
            spinAxeSystem(),
            simplifiedPhysics(),
            needleMovementSystem(),
            handleAxeHitEvents(),
            checkForAxeCollision(),

            spawnEnemiesSystem(),
            commenceToJigglin(),
            applyDragToHitEnemies(),

            updateSprites(),
            updateAnimatedSprites(sheets, animations),
            despawnSprites(container),
            despawnAnimatedSprites(container),
            addHoc(() => { ToneTiming.tick() }),
        ];
    }
}
