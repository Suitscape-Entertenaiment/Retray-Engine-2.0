//

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Swal from "sweetalert2";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { scene, camera, render, controls, grid, axis, ambient_light, GLTFloader } from '../core3d';

type Object3D = {
    name: string;
    type: string;
    object: THREE.Object3D;
    body: CANNON.Body;
}

type Light3D = {
    name: string;
    type: string;
    object: THREE.Light;
    body: CANNON.Body;
}

let objectList3d: { [key: string]: Object3D | Light3D } = {};

function crearObjeto3d(tipo: string, nombre: string){
  if(tipo == "cube"){
    crearCubo(nombre);
  }else if(tipo == "cone"){
    crearCono(nombre);
  }else if(tipo == "directionalLight"){
    crearLuzDireccional(nombre)
  }
}

function crearAsset3d(tipo: string, nombre: string, src: string){
  if(tipo == "Mesh"){
    crearMesh(nombre, src);
  }
}

function crearCubo(name: string){
  if (objectList3d[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
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

function crearCono(name: string){
  if (objectList3d[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
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

function crearLuzDireccional(name: string){
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
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

function crearMesh(name: string, src: string){
  GLTFloader.load(
    src, 
    function (gltf: any) {
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
    },
    undefined,
);
}

export { Object3D, Light3D, crearObjeto3d, crearAsset3d, objectList3d };