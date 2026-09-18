import { loadPyodide } from "pyodide";
import Swal from "sweetalert2";
import { axis, grid, camera, controls, ambient_light, cam3d_third_person_fn } from "../3d/core3d";
import { crearObjeto3d, crearAsset3d } from "../3d/objects/objects3d";
import { pantalla_tocada, tecla_tocada } from "../events/events";
import { editor } from "../code_editor/editor";
import { objectList3d } from "../3d/objects/objects3d";
import { objectList2d } from "../2d/objects2d/objects2d";
import { audioList } from "../multimedia/multimedia";
import { createAudio } from "../multimedia/audio/audio";

let pyodide: any = null;
let interruptBuffer: Int32Array | null = null;
let running: boolean = false;
let mode: string = "blocks";

const loader: HTMLElement | null = document.getElementById('loader');
const ltxt: HTMLElement | null = document.getElementById('ltxt');
const game_name: HTMLElement | null = document.getElementById("game_name");
const ot: HTMLElement | null = document.getElementById("ot");
const oc: HTMLElement | null = document.getElementById("optionalColor");

const datos_curiosos: string[] = ["Quiero mis Vacaciones Sr Pool...", "Prueben NewCatroid!"];
const indice: number = Math.floor(Math.random() * datos_curiosos.length);

const intervalId = setInterval(() => {
  if (pyodide) {
    if (ltxt) ltxt.textContent = "¡Listo!";
    if (loader) {
      loader.style.transition = "opacity 0.5s ease-out";
      loader.style.opacity = "0";
      setTimeout(() => loader!.style.display = 'none', 500);
    }
    clearInterval(intervalId);
  } else {
    if (ltxt) ltxt.textContent = datos_curiosos[indice];
  }
}, 300);

async function initPython(): Promise<void> {
  pyodide = await loadPyodide();
  interruptBuffer = new Int32Array(new SharedArrayBuffer(4));
  pyodide.setInterruptBuffer(interruptBuffer);
}

async function gameLoop(): Promise<void> {
  if (!running || !pyodide) return;
  try {
    await pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    running = false;
  }
  requestAnimationFrame(gameLoop);
}

async function ejecutar(): Promise<void> {
  const codigo: string = editor.state.doc.toString();
  try {
    axis.visible = false;
    grid.visible = false;
    Atomics.store(interruptBuffer!, 0, 0);
    pyodide.globals.set("create3dPrimitive", (tipo: string, nombre: string) => crearObjeto3d(tipo, nombre));
    pyodide.globals.set("move3d", (nombre: string, x: number, y: number, z: number) => objectList3d[nombre].object.position.set(x, y, z));
    pyodide.globals.set("rotate3d", (nombre: string, x: number, y: number, z: number) => objectList3d[nombre].object.rotation.set(x, y, z));
    pyodide.globals.set("scale3d", (nombre: string, x: number, y: number, z: number) => objectList3d[nombre].object.scale.set(x, y, z));
    pyodide.globals.set("toast", (msg: string) => Swal.fire({ text: msg }));
    pyodide.globals.set("cam3d_set_free", () => controls.enabled = true);
    pyodide.globals.set("cam3d_set_static", () => controls.enabled = false);
    pyodide.globals.set("cam3d_set", (x: number, y: number, z: number) => camera.position.set(x, y, z));
    pyodide.globals.set("cam3d_set_rotation", (x: number, y: number, z: number) => camera.rotation.set(x, y, z));
    pyodide.globals.set("cam3d_third_person", (obj: string, offsett: number) => cam3d_third_person_fn(objectList3d[obj], offsett));
    //pyodide.globals.set("set3dLightIntensity", (light: string, intensityy: number) => objectList3d[light].object.intensity = intensityy);
    //pyodide.globals.set("set3dLightColor", (light: string, colour: string) => objectList3d[light].object.color = colour);
    pyodide.globals.set("show3dAxes", () => axis.visible = true);
    pyodide.globals.set("hide3dAxes", () => axis.visible = false);
    pyodide.globals.set("createAudio", (name: string, src: string) => createAudio(name, src));
    pyodide.globals.set("playAudio", (name: string) => audioList[name].play());
    pyodide.globals.set("pauseAudio", (name: string) => audioList[name].pause());
    pyodide.globals.set("save", (key: string, value: string) => localStorage.setItem(key, value));
    pyodide.globals.set("load", (key: string) => localStorage.getItem(key));
    pyodide.globals.set("unsave", (key: string) => localStorage.removeItem(key));
    pyodide.globals.set("createAsset3d", (tipo: string, name: string, src: string) => crearAsset3d(tipo, name, src));
    pyodide.globals.set("screen_touched", () => pantalla_tocada());
    pyodide.globals.set("key_down", (key: string) => tecla_tocada(key));
    await pyodide.runPythonAsync(codigo);
    running = true;
    requestAnimationFrame(gameLoop);
  } catch (error: any) {
    Swal.fire({ title: 'Error Python', text: error.message, icon: 'error' });
  }
}

async function detener(): Promise<void> {
  running = false;
  Atomics.store(interruptBuffer!, 0, 2);
  await new Promise(r => requestAnimationFrame(r));
  axis.visible = true;
  grid.visible = true;
  for (let key in objectList3d) {
    delete objectList3d[key];
  }
  for (let key in objectList2d) {
    delete objectList2d[key];
  }
}

window.addEventListener("load", async () => {
  await initPython();
  if (loader) loader.style.display = 'none';
});

export { loader, ltxt, game_name, ot, oc, ejecutar, detener, pyodide, running, mode, initPython, gameLoop };