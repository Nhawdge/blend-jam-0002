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
import { SceneBuilder } from "../SceneManager";
import PlayerAnimations, { playerMovementSystem, spawnPlayer } from './Player';
<<<<<<< HEAD
import { needleMovementSystem, spawnNeedle } from './Needle';
=======
import ENEMIES, { IEnemyInfo, spawnEnemiesSystem } from './Enemy';
import { spawnNeedle } from './Needle';
>>>>>>> b6e7dfd0eaacababc274e3bf3f14f5d9805ac589


export default async function mainGameScene() : Promise<SceneBuilder> {
    const textures = createResourceMap<PIXI.Texture>();
    const bg = textures.add(await PIXI.Assets.load('assets/prototype-level.png') as PIXI.Texture);
    const needleTexture = textures.add(await PIXI.Assets.load('assets/needle.png') as PIXI.Texture);

    const sheets = createResourceMap<PIXI.Spritesheet>();
    const animations = createResourceMap<string>();
    const playerSheet = sheets.add(await loadAseprite('assets/player/player.png', 'assets/player/player.json'));

    // Define enemies
    const chordTags = createResourceMap<string>();
    const chord:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/chord-enemy.png', 'assets/enemy/chord-enemy.json')),
        minTimeToSpawn: 5,
        spawnRate: 1,
        tags: chordTags,
        animations: {
            idle: chordTags.add('idle')
        }
    };
    ENEMIES.push(chord);

    const leadTags = createResourceMap<string>();
    const lead:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/lead-enemy.png', 'assets/enemy/lead-enemy.json')),
        minTimeToSpawn: 3,
        spawnRate: 1,
        tags: leadTags,
        animations: {
            idle: leadTags.add('idle')
        }
    };
    ENEMIES.push(lead);

    const snareTags = createResourceMap<string>();
    const snare:IEnemyInfo = {
        sheet: sheets.add(await loadAseprite('assets/enemy/snare-enemy.png', 'assets/enemy/snare-enemy.json')),
        minTimeToSpawn: 3,
        spawnRate: 1,
        tags: snareTags,
        animations: {
            idle: snareTags.add('idle')
        }
    };
    ENEMIES.push(snare);

    PlayerAnimations.Idle = animations.add('idle');

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


        return [
            spawnSprites(textures, container),
            spawnAnimatedSprites(sheets, animations, container),

            playerMovementSystem(),
            simplifiedPhysics(),
            needleMovementSystem(),

            spawnEnemiesSystem(),

            updateSprites(),
            updateAnimatedSprites(sheets, animations),
            despawnSprites(container),
            despawnAnimatedSprites(container),
        ];
    }
}
