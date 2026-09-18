import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { Object2D, objectList2d } from './objects2d/objects2d';

const game = new PIXI.Application({
    view: document.getElementById('view-2d') as HTMLCanvasElement,
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

const container = new PIXI.Container();

game.stage.addChild(container);

const physicsEngine = Matter.Engine.create();
const world = physicsEngine.world;
world.gravity.y = 1;

function updatePhysics() {
    Matter.Engine.update(physicsEngine, 1000 / 60);

    for (const objName in objectList2d) {
        const obj = objectList2d[objName];
        obj.displayObject.x = obj.body.position.x;
        obj.displayObject.y = obj.body.position.y;
        obj.displayObject.rotation = obj.body.angle;
    }

    requestAnimationFrame(updatePhysics);
}

updatePhysics();

export { game, physicsEngine, world };