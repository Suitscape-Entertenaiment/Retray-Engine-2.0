import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { game } from '../core2d';
let objectList2d = {};
export function create2dObject(type, name) {
    let object = new PIXI.Graphics();
    let body;
    switch (type) {
        case 'rectangle':
            object = new PIXI.Graphics();
            object.beginFill(0xFF0000);
            object.drawRect(0, 0, 100, 100);
            object.endFill();
            body = Matter.Bodies.rectangle(50, 50, 100, 100);
            break;
        case 'circle':
            object = new PIXI.Graphics();
            object.beginFill(0x00FF00);
            object.drawCircle(0, 0, 50);
            object.endFill();
            body = Matter.Bodies.circle(50, 50, 50);
            break;
        default:
            console.error(`Unknown 2D object type: ${type}`);
            return;
    }
    objectList2d[name] = { name, type, displayObject: object, body };
    game.stage.addChild(object);
}
export { objectList2d };
//# sourceMappingURL=objects2d.js.map