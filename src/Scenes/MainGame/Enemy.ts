
export type IEnemyInfo = {
    sheet: number,
    spawnRate: number,
    minTimeToSpawn: number,
    tags: IResourceMap<string>,
    animations: {
        idle: number
    }
}

import { defineComponent, defineSystem, Types } from "bitecs";
import { IResourceMap } from "../../IResourceMap";
import DeltaTime from "../../Resources/DeltaTime";

const ENEMIES: IEnemyInfo[] = [];

const Enemy = defineComponent({
    type: Types.ui8,
    speed: Types.f32,
    life: Types.f32,
    note: Types.ui8,
});

export function spawnEnemiesSystem() {
    let nextSpawn = 5000;
    let totalTime = 0;

    return defineSystem((world) => {
        const delta = DeltaTime.get();

        nextSpawn = nextSpawn - delta;
        totalTime += delta;

        if (nextSpawn < 0) {
            let availableSpawns = ENEMIES.filter(x => x.minTimeToSpawn < totalTime)
                .map((v, i) => ({ weight: v.spawnRate,  index: i }));

            /*
            let totalWeight = availableSpawns.reduce((agg, v) => v.weight + agg, 0);
            let choice = Math.floor(Math.random() * totalWeight);
            let result = availableSpawns.find(x => x.weight >= choice);
            if (!result)
                result = availableSpawns[availableSpawns.length - 1];
            */

            const choice = Math.floor(Math.random() * availableSpawns.length);
            const result = availableSpawns[choice];

            nextSpawn = (Math.random() * 5) + 3;
        }

        return world;
    });
}



export default ENEMIES;

