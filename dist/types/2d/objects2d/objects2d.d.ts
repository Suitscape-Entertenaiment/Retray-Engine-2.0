import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
type Object2D = {
    name: string;
    type: string;
    displayObject: PIXI.Graphics;
    body: Matter.Body;
};
declare let objectList2d: {
    [key: string]: Object2D;
};
export declare function create2dObject(type: string, name: string): void;
export { objectList2d, Object2D };
