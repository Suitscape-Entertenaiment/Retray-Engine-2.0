import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { game, physicsEngine, world } from '../core2d';

type Object2D = {
    name: string;
    type: string;
    displayObject: PIXI.Graphics;
    body: Matter.Body;
};

let objectList2d: { [key: string]: Object2D } = {};

export function create2dObject(type: string, name: string): void {
    let object = new PIXI.Graphics();
    let body: Matter.Body;
    switch (type) {
        case 'rectangle':
            object = new PIXI.Graphics();
            (object as PIXI.Graphics).beginFill(0xFF0000);
            (object as PIXI.Graphics).drawRect(0, 0, 100, 100);
            (object as PIXI.Graphics).endFill();
            body = Matter.Bodies.rectangle(50, 50, 100, 100);
            break;  
        case 'circle':
            object = new PIXI.Graphics();
            (object as PIXI.Graphics).beginFill(0x00FF00);
            (object as PIXI.Graphics).drawCircle(0, 0, 50);
            (object as PIXI.Graphics).endFill();
            body = Matter.Bodies.circle(50, 50, 50);
            break;
        default:
            console.error(`Unknown 2D object type: ${type}`);
            return;
    }
    objectList2d[name] = { name, type, displayObject: object, body };
    game.stage.addChild(object);
}

export { objectList2d, Object2D };