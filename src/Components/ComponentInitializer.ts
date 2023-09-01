import { addEntity, IWorld } from "bitecs"

export type initComponent = (world:IWorld, entity:number) => void;

export function composeEntity(world:IWorld, components:initComponent[]) : number {
    const entity = addEntity(world);
    for (const component of components) {
        component(world, entity);
    }
    return entity;
}