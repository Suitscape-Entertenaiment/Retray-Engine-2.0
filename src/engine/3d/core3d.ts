import * as THREE from "three";
import Swal from "sweetalert2";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Object3D, objectList3d } from './objects/objects3d';
import * as CANNON from 'cannon-es';
import { Object3D as Object3DType } from './objects/objects3d';

const canvas3d = document.getElementById('view3d') as HTMLCanvasElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 360 / 250, 0.1, 1000);
camera.position.z = 5;

const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);

const render = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
render.setSize(360, 250);

const controls = new OrbitControls(camera, canvas3d);

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const axis = new THREE.AxesHelper(2);
axis.position.y += 0.002;
scene.add(axis);

const ambient_light = new THREE.AmbientLight( 0x404040 );
scene.add(ambient_light);

const GLTFloader = new GLTFLoader();

function cam3d_third_person_fn(obj: Object3D, offsett: number): void {
  const target = objectList3d[obj.name]?.object;
  if (target instanceof THREE.Object3D) {
    const offset = new THREE.Vector3(0, 5, offsett);
    const camPos = target.position.clone().add(offset);

    camera.position.copy(camPos);
    camera.lookAt(target.position);
  }
}

function animate(): void {
  requestAnimationFrame(animate);
  controls.update();

  for (const objName in objectList3d) {
    const obj = objectList3d[objName];
    if (obj.body) {
      obj.object.position.copy(obj.body.position as unknown as THREE.Vector3);
      obj.object.quaternion.copy(obj.body.quaternion as unknown as THREE.Quaternion);
    }
  }
  
  render.render(scene, camera);
}

animate();

export { scene, camera, render, controls, grid, axis, ambient_light, GLTFloader, physicsWorld, cam3d_third_person_fn };