import { Tilemap } from "@pixi/tilemap";
import { addComponent, addEntity, IWorld } from "bitecs";
import { Spritesheet } from "pixi.js";
import Position from "../Components/Position";
import StaticBody from "../Components/StaticBody";
import constants from "../constants";
import Collider from "./Collider";

export function spawnLdtkTilemap(
    sheet:Spritesheet, 
    ldtk:any, 
    levelName:string, 
    layerName:string
): Tilemap {
    const level = ldtk.levels.find((x:any) => x.identifier === levelName);
    const layer = level.layerInstances.find((x:any) => x.__identifier === layerName);

    const tilemap = new Tilemap(sheet.baseTexture);

    for (const tile of layer.gridTiles) {
        tilemap.tile(sheet.textures[tile.t], tile.px[0] + 1, tile.px[1] + 1);
    }

    return tilemap;
}



const NEAR = 0; // Near the origin of the box (south west)
const FAR = 1;  // Far from the origin (north east)

const HORIZONTAL = 0; // Index of the X axis
const VERTICAL = 1;   // Index of the y axis

export function spawnLdtkColliders(
    world: IWorld,
    ldtk:any, 
    levelName:string, 
    layerName:string,
) {
    const level = ldtk.levels.find((x:any) => x.identifier === levelName);
    const layer = level.layerInstances.find((x:any) => x.__identifier === layerName);

    let colliders = layer.intGridCsv.map((v:number, index:number) => {
        const y = Math.floor(index / layer.__cWid);
        const x = index - (y * layer.__cWid);
        switch (v) {
            case 0: return null; // No collider
            case 1:
            case 2:
                // Originally 1 = horizontal and 2 = vertical, but
                // not really necessary to discern in this version.
                // Create a single square collider
                return Collider.create(x, y, 1, 1);
            default:
                return null; // ¯\_(ツ)_/¯
        }
    }).filter((block:any) => block !== null);

    let simplified = simplifyColliders(colliders, HORIZONTAL);
    simplified = simplifyColliders(simplified, VERTICAL);

    for (const collider of simplified) {
        const width = collider.getLength(HORIZONTAL) * constants.TILE_SIZE;
        const height = collider.getLength(VERTICAL) * constants.TILE_SIZE;
        const bottomLeftX = collider.getSide(HORIZONTAL, NEAR) * constants.TILE_SIZE;
        const bottomLeftY = collider.getSide(VERTICAL, NEAR) * constants.TILE_SIZE;

        const centerX = bottomLeftX + (width / 2);
        const centerY = bottomLeftY + (height / 2);

        const entity = addEntity(world);
        addComponent(world, Position, entity);
        Position.x[entity] = centerX;
        Position.y[entity] = centerY;

        addComponent(world, StaticBody, entity);
        StaticBody.width[entity] = width / 2;
        StaticBody.height[entity] = height / 2;
    }
}

function simplifyColliders(colliders:Collider[], axis:number) {
    const solved:Collider[] = [];
    const otherAxis = axis == 1 ? 0 : 1;

    while (colliders.length > 0) {
        let popped = colliders.pop()!;

        let solvedItem = [NEAR, FAR].reduce((acc, side) => {
            let otherSide = side == 1 ? 0 : 1;

            let matched = solved.findIndex((c) => {
                return c.getSide(axis, otherSide) == acc.getSide(axis, side)
                    && c.getSide(otherAxis, otherSide) == acc.getSide(otherAxis, otherSide)
                    && c.getSide(otherAxis, side) == acc.getSide(otherAxis, side)
            });

            if (matched < 0) {
                return acc;
            }
                
            let removedItem = solved.splice(matched, 1)[0];
            let extended_item = acc.extend(axis, otherSide, removedItem.getLength(axis));
            return extended_item;
        }, popped);

        solved.push(solvedItem);
    }

    return solved;
}