import * as PIXI from 'pixi.js';
import { composeEntity, include } from '../../Components/ComponentInitializer';
import { addPosition } from '../../Components/Position';
import { addSprite } from '../../Components/Spite';
import createResourceMap from "../../IResourceMap";
import { despawnAnimatedSprites, spawnAnimatedSprites, updateAnimatedSprites } from '../../Systems/AnimatedSpriteSystem';
import { despawnSprites, spawnSprites, updateSprites } from '../../Systems/SpriteSystem';
import { loadAseprite } from '../../Utils/AsepriteUtilities';
import IGameContext from '../GameContext';
import { SceneBuilder } from "../SceneManager";
import PlayerAnimations, { spawnPlayer } from './Player';


export default async function mainGameScene() : Promise<SceneBuilder> {
    const textures = createResourceMap<PIXI.Texture>();
    const bg = textures.add(await PIXI.Assets.load('assets/game-background.png') as PIXI.Texture);
    const playhead = textures.add(await PIXI.Assets.load('assets/playhead.png') as PIXI.Texture);

    const sheets = createResourceMap<PIXI.Spritesheet>();
    const animations = createResourceMap<string>();
    const playerSheet = sheets.add(await loadAseprite('assets/player/player.png', 'assets/player/player.json'));

    PlayerAnimations.Idle = animations.add('idle');



    return ({ world, container }: IGameContext) => {
        composeEntity(
            world,
            [
                addPosition(400, 200),
                addSprite(bg)
            ]
        );


        composeEntity(
            world,
            [
                addSprite(playhead, 400, 400)
            ]
        );

        spawnPlayer(world, playerSheet);


        return [
            spawnSprites(textures, container),
            spawnAnimatedSprites(sheets, animations, container),

            updateSprites(),
            updateAnimatedSprites(sheets, animations),
            despawnSprites(container),
            despawnAnimatedSprites(container),
        ];
    }
}
