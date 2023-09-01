import { IWorld } from 'bitecs';
import * as PIXI from 'pixi.js';

export default interface IGameContext {
    container: PIXI.Container,
    hud: PIXI.Container,
    world: IWorld,
}
