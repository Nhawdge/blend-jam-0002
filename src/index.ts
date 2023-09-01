import { Application, extensions, SCALE_MODES, settings } from 'pixi.js';
import createResourceMap from './IResourceMap';
import { manageScenes, SceneBuilder } from './Scenes/SceneManager';
import sceneResource from './Resources/SceneResource';
import SceneNames from './Scenes/SceneNames';
import consts from './constants';
import mainMenuScene from './Scenes/MainMenu/MainMenu';
import mainGameScene from './Scenes/MainGame/MainGame';

const scale = 5;

async function main() {
  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  const app = new Application({
    width: consts.STAGE_SIZE[0] * consts.SCALE,
    height: consts.STAGE_SIZE[1] * consts.SCALE,
  });


  settings.SCALE_MODE = SCALE_MODES.NEAREST;

  app.view.width = consts.STAGE_SIZE[0] * consts.SCALE;
  app.view.height = consts.STAGE_SIZE[1] * consts.SCALE;
  app.stage.scale.x = consts.SCALE;
  app.stage.scale.y = consts.SCALE;
  
  
  // The application will create a canvas element for you that you
  // can then insert into the DOM
  document.body.appendChild(app.view as any);

  // Load all scenes
  const scenes = createResourceMap<SceneBuilder>();
  SceneNames.MainMenu = scenes.add(await mainMenuScene());
  SceneNames.Game = scenes.add(await mainGameScene());
  sceneResource.set(SceneNames.MainMenu);

  manageScenes(scenes, app);
}
main().catch(console.error);
