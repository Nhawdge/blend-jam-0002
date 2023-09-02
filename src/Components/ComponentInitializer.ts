import { addComponent, addEntity, Component, IWorld } from "bitecs"

export type initComponent = (world:IWorld, entity:number) => void;

export function include(component:Component):initComponent {
    return (world, entity) => {
        addComponent(world, component, entity);
    };
}

export function composeEntity(world:IWorld, components:initComponent[]) : number {
    const entity = addEntity(world);
    updateEntity(world, entity, components);
    return entity;
}

export function updateEntity(world:IWorld, entity:number, components:initComponent[]) {
    for (const component of components) {
        component(world, entity);
    }
}