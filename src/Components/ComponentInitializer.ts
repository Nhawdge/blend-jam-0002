import { addComponent, addEntity, Component, IWorld } from "bitecs"

export type initComponent = (world:IWorld, entity:number) => void;

export function include(component:Component):initComponent {
    return (world, entity) => {
        addComponent(world, component, entity);
    };
}

export function composeEntity(world:IWorld, components:initComponent[]) : number {
    const entity = addEntity(world);
    for (const component of components) {
        component(world, entity);
    }
    return entity;
}