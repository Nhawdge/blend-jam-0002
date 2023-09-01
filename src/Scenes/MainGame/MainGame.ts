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
import { spawnNeedle } from './Needle';


export default async function mainGameScene() : Promise<SceneBuilder> {
    const textures = createResourceMap<PIXI.Texture>();
    const bg = textures.add(await PIXI.Assets.load('assets/prototype-level.png') as PIXI.Texture);
    const needleTexture = textures.add(await PIXI.Assets.load('assets/needle.png') as PIXI.Texture);

    const sheets = createResourceMap<PIXI.Spritesheet>();
    const animations = createResourceMap<string>();
    const playerSheet = sheets.add(await loadAseprite('assets/player/player.png', 'assets/player/player.json'));

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

            updateSprites(),
            updateAnimatedSprites(sheets, animations),
            despawnSprites(container),
            despawnAnimatedSprites(container),
        ];
    }
}
