import * as PIXI from 'pixi.js';
import { defineQuery, defineSystem, enterQuery } from "bitecs";
import KineticBody from "../Components/KineticBody";
import Position from "../Components/Position";
import StaticBody from "../Components/StaticBody";
import Velocity from "../Components/Velocity";
import Weight from "../Components/Weight";
import AABB from "../Utils/AABB";
import Vec2 from "../Utils/Vec2";
import Events from '../Events/Events';

const COLLISION_BIAS = 0.1;

export type CollisionEvent = {
    kineticEntity: number,
    point: Vec2,
    normal: Vec2,
    moment: number
};

export function debugColliders(container:PIXI.Container) {
    const colliderQuery = defineQuery([Position, StaticBody]);
    const colliderEnter = enterQuery(colliderQuery);

    return defineSystem((world) => {
        for (const c of colliderEnter(world)) {
            var graphics = new PIXI.Graphics();

            const pos = new Vec2(
                Position.x[c],
                Position.y[c]
            );
            const halfSize = new Vec2(
                StaticBody.width[c],
                StaticBody.height[c]
            );

            const lowerLeftPos = pos.sub(halfSize);
            const fullSize = halfSize.timesScalar(2);

            graphics.beginFill(0xFFFF00);
            graphics.lineStyle(1, 0xFF0000);
            graphics.drawRect(lowerLeftPos.x, lowerLeftPos.y, fullSize.x, fullSize.y);

            container.addChild(graphics);
        }

        return world;
    })
}

export function simplifiedPhysics() {
    const kineticsQuery = defineQuery([Position, Velocity]);

    return defineSystem((world) => {

        for (const entity of kineticsQuery(world)) {
            // TODO: Constraints

            Position.x[entity] += Velocity.x[entity];
            Position.y[entity] += Velocity.y[entity];
        }

        return world;
    });
}

export function applyPhysics() {
    const kineticsQuery = defineQuery([Position, Velocity, KineticBody]);
    const staticBodyQuery = defineQuery([Position, StaticBody]);
    const weightQuery = defineQuery([Velocity, Weight]);

    return defineSystem((world) => {
        for (const entity of weightQuery(world)) {
            Velocity.y[entity] += Weight.gravity[entity];
        }

        const staticBodies = staticBodyQuery(world);

        for (const kineticEntity of kineticsQuery(world)) {
            // Track changes
            Velocity.previousX[kineticEntity] = Velocity.x[kineticEntity];
            Velocity.previousY[kineticEntity] = Velocity.y[kineticEntity];
            KineticBody.wasGrounded[kineticEntity] = KineticBody.grounded[kineticEntity];

            // Create utility objects
            const kinBody = AABB.create(
                Position.x[kineticEntity],
                Position.y[kineticEntity],
                KineticBody.width[kineticEntity],
                KineticBody.height[kineticEntity],
            );

            let velocity = new Vec2(
                Velocity.x[kineticEntity],
                Velocity.y[kineticEntity]
            );
            let isGrounded = false;

            // Create all the AABB static body representations
            let /* the */ bodies /* hit the floor */ = staticBodies.map(eid => {
                const statBody = AABB.create(
                    Position.x[eid],
                    Position.y[eid],
                    StaticBody.width[eid] + kinBody.size.x,
                    StaticBody.height[eid] + kinBody.size.y,
                );

                return { eid, body: statBody };
            })

            let collisions = bodies.map(body => body.body.detectRayCollision(kinBody.pos, velocity))
                .filter(x => x != null)
                .map(y => y!);

            collisions.sort((a, b) => a.moment - b.moment);

            let maxTries = 10; // Limit this to 10 tries. After that we're probably stuck in an infinite loop.
            while (collisions.length > 0 && maxTries > 0) {
                const collision = collisions[0];
                Events.collisions.push({
                    kineticEntity: kineticEntity,
                    moment: collision.moment,
                    normal: collision.normal,
                    point: collision.point
                });

                const velocityAdjustment = collision.normal.times(velocity.abs()).timesScalar(1 - collision.moment);
                velocity = velocity.add(velocityAdjustment);

                // A nudge in the direction of the normal
                const positionAdjustment = collision.normal.timesScalar(COLLISION_BIAS);
                kinBody.pos = kinBody.pos.add(positionAdjustment);

                isGrounded = isGrounded || collision.normal.y < 0;

                // Now we need to pull the collisions again and retry
                collisions = bodies.map(body => body.body.detectRayCollision(kinBody.pos, velocity))
                    .filter(x => x != null)
                    .map(y => y!);

                collisions.sort((a, b) => a.moment - b.moment);

                maxTries--;
            }

            if (maxTries <= 0) { console.log('Reached max tries'); }

            // Apply transformation
            kinBody.pos = kinBody.pos.add(velocity);
            Velocity.x[kineticEntity] = velocity.x;
            Velocity.y[kineticEntity] = velocity.y;
            Position.x[kineticEntity] = kinBody.pos.x;
            Position.y[kineticEntity] = kinBody.pos.y;
            KineticBody.grounded[kineticEntity] = isGrounded ? 1 : 0;
        }
        return world;
    })
}
