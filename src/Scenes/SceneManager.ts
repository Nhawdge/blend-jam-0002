import { createWorld, defineQuery, IWorld, removeEntity, System } from "bitecs";
import * as PIXI from "pixi.js";
import { IResourceMap } from "../IResourceMap";
import DeltaTime from "../Resources/DeltaTime";
import sceneResource from '../Resources/SceneResource';
import keys from '../Resources/KeysResource';
import consts from '../constants';
import IGameContext from "./GameContext";
import Events from "../Events/Events";
import commands from "../Resources/Commands";

export type SceneBuilder = (context:IGameContext) => System<[], IWorld>[];

export function manageScenes(
    scenes: IResourceMap<SceneBuilder>, 
    app: PIXI.Application
) {

    function executeScene() {
        const world = createWorld();
        let sceneId  = sceneResource.get();
    
        const hud = new PIXI.Container();
        app.stage.addChild(hud);
    
        const container = new PIXI.Container();
        container.position.x = consts.STAGE_SIZE[0] / 2;
        container.position.y = consts.STAGE_SIZE[1] / 2;

        app.stage.addChild(container);
        const sceneBuilder = scenes.get(sceneId);

        let context:IGameContext = {
            container,
            hud,
            world
        } ;

        let systems = sceneBuilder(context);

        app.ticker.add(() => {
            DeltaTime.set(app.ticker.elapsedMS);

            for (const sys of systems) {
                sys(world);
            }

            keys.tick();
            Events.tickAll();
            commands.executePending(world);

            // Check for scene change
            const newSceneId = sceneResource.get();
            if (newSceneId === sceneId)
                return;
                

            sceneId = newSceneId;
            // Destroy existing world 💣
            const allEntities = defineQuery([]);
            for (const eid of allEntities(world)) {
                removeEntity(world, eid);
            }
            
            // Build a new world 🌼
            const newScene = scenes.get(sceneId);
            systems = newScene(context);
        });
    }

    executeScene();
}
