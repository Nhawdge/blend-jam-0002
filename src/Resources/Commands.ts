import { IWorld } from "bitecs";
import { composeEntity, initComponent } from "../Components/ComponentInitializer";

export type command = (world:IWorld) => void;

let commands:command[] = [];

export default {
    add: (cmd:command) => {
        commands.push(cmd);
    },
    spawn(components:initComponent[]) {
        this.add((world) => {
            composeEntity(world, components);
        })
    },
    executePending: (world:IWorld) => {
        if (commands.length === 0) { return; }
        
        for (const cmd of commands) {
            cmd(world);
        }
        commands = [];
    }
}
