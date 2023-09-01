import * as PIXI from 'pixi.js';
import { defineComponent, defineQuery, defineSystem, removeEntity } from "bitecs";
import createResourceMap from "../../IResourceMap";
import IGameContext from "../GameContext";
import { SceneBuilder } from "../SceneManager";
import { addPosition } from '../../Components/Position';
import { composeEntity, include } from '../../Components/ComponentInitializer';
import { addSprite } from '../../Components/Spite';
import { despawnSprites, spawnSprites, updateSprites } from '../../Systems/SpriteSystem';
import keys from '../../Resources/KeysResource';
import sceneResource from '../../Resources/SceneResource';
import SceneNames from '../SceneNames';
import { loadAseprite } from '../../Utils/AsepriteUtilities';
import { addAnimatedSprite } from '../../Components/AnimatedSprite';
import { despawnAnimatedSprites, spawnAnimatedSprites } from '../../Systems/AnimatedSpriteSystem';

const MainMenu = defineComponent({});


function mainMenu () {
    return defineSystem((world) => {
        if (!keys.keyJustReleased(' '))
            return world;
    
        // Otherwise, move on to the next scene
        sceneResource.set(SceneNames.Game);
    
        const allEntities = defineQuery([]);
        for (const eid of allEntities(world)) {
            removeEntity(world, eid);
        }
    
        return world;
    });
} 

export default async function mainMenuScene() : Promise<SceneBuilder> {

    const sheets = createResourceMap<PIXI.Spritesheet>();
    const animations = createResourceMap<string>();
    const menuSheet = sheets.add(await loadAseprite('assets/itch-title-screen-sheet.png', 'assets/itch-title-screen.json', 'menu:'));
    const idle = animations.add('menu:idle');


    return function({world, container}:IGameContext) {
        composeEntity(
            world,
            [
                addPosition(0, 0),
                include(MainMenu),
                addAnimatedSprite(menuSheet, idle)
            ]
        );

        return [
            spawnAnimatedSprites(sheets, animations, container),
            mainMenu(),

            updateSprites(),
            despawnAnimatedSprites(container)
        ];
    }
}