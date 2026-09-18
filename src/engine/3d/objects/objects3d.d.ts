import * as THREE from 'three';
import * as CANNON from 'cannon-es';
type Object3D = {
    name: string;
    type: string;
    object: THREE.Object3D;
    body: CANNON.Body;
};
type Light3D = {
    name: string;
    type: string;
    object: THREE.Light;
    body: CANNON.Body;
};
declare let objectList3d: {
    [key: string]: Object3D | Light3D;
};
declare function crearObjeto3d(tipo: string, nombre: string): void;
declare function crearAsset3d(tipo: string, nombre: string, src: string): void;
export { Object3D, Light3D, crearObjeto3d, crearAsset3d, objectList3d };
