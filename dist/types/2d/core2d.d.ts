import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
declare const game: PIXI.Application<PIXI.Renderer>;
declare const physicsEngine: Matter.Engine;
declare const world: Matter.World;
export { game, physicsEngine, world };
