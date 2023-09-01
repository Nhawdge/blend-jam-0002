import * as PIXI from 'pixi.js';
import consts from '../../constants';

export type IEnemyInfo = {
    speed: number,
    sheet: number,
    spawnRate: number,
    minTimeToSpawn: number,
    animations: {
        idle: number
    }
}

import { addComponent, defineComponent, defineSystem, IWorld, Types } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity, initComponent } from "../../Components/ComponentInitializer";
import DeltaTime from "../../Resources/DeltaTime";
import { addPosition } from '../../Components/Position';

const ENEMIES: IEnemyInfo[] = [];

const Enemy = defineComponent({
    type: Types.ui8 // Index into IEnemyInfo
});

function addEnemy(enemy:number):initComponent {
    return (world, entity) => {
        addComponent(world, Enemy, entity);
        Enemy.type[entity] = enemy;
    };
}

export function spawnEnemiesSystem() {
    let nextSpawn = 5000;
    let totalTime = 0;
    let totalEnemies = 0;

    return defineSystem((world) => {
        const delta = DeltaTime.get();

        nextSpawn = nextSpawn - delta;
        totalTime += delta;

        if (nextSpawn < 0 && totalEnemies < consts.MAX_ENEMIES_ON_SCREEN) {
            let availableSpawns = ENEMIES.filter(x => x.minTimeToSpawn < totalTime)
                .map((v, i) => ({ weight: v.spawnRate,  index: i }));

            // TODO: Weighted choice
            /*
            let totalWeight = availableSpawns.reduce((agg, v) => v.weight + agg, 0);
            let choice = Math.floor(Math.random() * totalWeight);
            let result = availableSpawns.find(x => x.weight >= choice);
            if (!result)
                result = availableSpawns[availableSpawns.length - 1];
            */

            const choice = Math.floor(Math.random() * availableSpawns.length);
            const result = availableSpawns[choice];
            const enemyInfo = ENEMIES[result.index];

            const x = (Math.random() * consts.SPAWN_SIZE) - (consts.SPAWN_SIZE / 2);
            const y = (Math.random() * consts.SPAWN_SIZE) - (consts.SPAWN_SIZE / 2);
            
            composeEntity(world, [
                addEnemy(result.index),
                addAnimatedSprite(
                    enemyInfo.sheet,
                    enemyInfo.animations.idle
                ),
                addPosition(x, y)
            ]);


            nextSpawn = (Math.random() * 2000) + 1000;
        }

        return world;
    });
}



export default ENEMIES;

