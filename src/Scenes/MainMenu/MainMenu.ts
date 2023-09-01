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

    const textures = createResourceMap<PIXI.Texture>();
    const menu = textures.add(await PIXI.Assets.load('assets/menu-background.png') as PIXI.Texture);


    return function({world, container}:IGameContext) {
        composeEntity(
            world,
            [
                addPosition(0, 0),
                include(MainMenu),
                addSprite(menu)
            ]
        );

        return [
            spawnSprites(textures, container),
            mainMenu(),

            updateSprites(),
            despawnSprites(container)
        ];
    }
}