//
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Swal from "sweetalert2";
import { scene, GLTFloader } from '../core3d';
let objectList3d = {};
function crearObjeto3d(tipo, nombre) {
    if (tipo == "cube") {
        crearCubo(nombre);
    }
    else if (tipo == "cone") {
        crearCono(nombre);
    }
    else if (tipo == "directionalLight") {
        crearLuzDireccional(nombre);
    }
}
function crearAsset3d(tipo, nombre, src) {
    if (tipo == "Mesh") {
        crearMesh(nombre, src);
    }
}
function crearCubo(name) {
    if (objectList3d[name]) {
        Swal.fire({
            title: "Error De Creación",
            text: `Ya existe un Objeto con El Nombre ${name}`,
            icon: "error",
            showConfirmButton: true
        });
        return;
    }
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const mesh = new THREE.Mesh(geometry, material);
    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    });
    objectList3d[name] = {
        name: name,
        type: "cube",
        object: mesh,
        body: body
    };
    scene.add(mesh);
}
function crearCono(name) {
    if (objectList3d[name]) {
        Swal.fire({
            title: "Error De Creación",
            text: `Ya existe un Objeto con El Nombre ${name}`,
            icon: "error",
            showConfirmButton: true
        });
        return;
    }
    const geometry = new THREE.ConeGeometry(5, 10, 22);
    const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const mesh = new THREE.Mesh(geometry, material);
    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Cylinder(0, 5, 10, 22)
    });
    objectList3d[name] = {
        name: name,
        type: "cone",
        object: mesh,
        body: body
    };
    scene.add(mesh);
}
function crearLuzDireccional(name) {
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Sphere(0.1)
    });
    objectList3d[name] = {
        name: name,
        type: "directionalLight",
        object: light,
        body: body
    };
    scene.add(light);
}
function crearMesh(name, src) {
    GLTFloader.load(src, function (gltf) {
        const obj = gltf.scene;
        obj.name = name;
        scene.add(obj);
        const body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        });
        objectList3d[name] = {
            name: name,
            type: "mesh",
            object: obj,
            body: body
        };
    }, undefined);
}
export { crearObjeto3d, crearAsset3d, objectList3d };
//# sourceMappingURL=objects3d.js.map