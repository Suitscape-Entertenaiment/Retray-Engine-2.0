function exportarHTML() {
  let template = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${game_name.value}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
#game_view3d, #game_view2d {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}
#game_view3d { z-index: 1; background: black; }
#game_view2d { z-index: 2; background: transparent; pointer-events: none; }
#game_loader{
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;
  display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 20px;
  background: ${optionalColor.value};
}
#game_ltxt, #game_optionalText {
  color: white; font-size: 20px; font-weight: bold;
  text-shadow: 2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black;
}
</style>
</head>
<body>
<canvas id="game_view3d"></canvas>
<canvas id="game_view2d"></canvas>
<div id="game_loader">
  <img src="./assets/logooo.png" width="200px" height="200px">
  <h2 id="game_optionalText">${ot.value}</h2>
  <div class="spinner-border m-5" role="status"></div>
  <p id="game_ltxt">cargando...</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>

<script src="https://unpkg.com/three@0.140.0/build/three.min.js"></script>
<script src="https://unpkg.com/three@0.140.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.140.0/examples/js/loaders/GLTFLoader.js"></script>

<script>
const game_code = ${JSON.stringify(editor.getValue())};

const game_canvas3d = document.getElementById('game_view3d');
const game_canvas2d = document.getElementById('game_view2d');
game_canvas2d.width = window.innerWidth;
game_canvas2d.height = window.innerHeight;
const game_ctx = game_canvas2d.getContext('2d');
game_ctx.font = "20px Arial";

const game_loader = document.getElementById('game_loader');
const game_ltxt = document.getElementById('game_ltxt');
const game_optionalText = document.getElementById('game_optionalText');

const game_scene = new THREE.Scene();
const game_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
game_camera.position.z = 5;

const game_renderer = new THREE.WebGLRenderer({ canvas: game_canvas3d, antialias: true });
game_renderer.setSize(window.innerWidth, window.innerHeight);

const game_controls = new THREE.OrbitControls(game_camera, game_canvas3d);
const game_axis = new THREE.AxesHelper(2);
game_axis.position.y += 0.002;
game_scene.add(game_axis);

const game_grid = new THREE.GridHelper(100, 100);
game_scene.add(game_grid);

const game_ambientLight = new THREE.AmbientLight(0x404040);
game_scene.add(game_ambientLight);

const game_gltfLoader = new THREE.GLTFLoader();

function game_drawCircle(x, y, r){
  game_ctx.beginPath();
  game_ctx.arc(x, y, r, 0, Math.PI * 2);
  game_ctx.fill();
}

function game_animate(){
  requestAnimationFrame(game_animate);
  game_controls.update();
  game_renderer.render(game_scene, game_camera);
}
game_animate();

let game_objectList = {};
let game_pantallaTocada = false;
let game_teclaTocada = null;

function game_crearObjeto(tipo, nombre){
  if(tipo == "cube"){
    game_crearCubo(nombre);
  }else if(tipo == "cone"){
    game_crearCono(nombre);
  }else if(tipo == "directionalLight"){
    game_crearLuzDireccional(nombre);
  }
}

function game_crearAsset3d(tipo, nombre, src){
  if(tipo == "Mesh"){
    game_crearMesh(nombre, src);
  }
}

function game_crearCubo(name){
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const mesh = new THREE.Mesh(geometry, material);
  game_objectList[name] = mesh;
  game_scene.add(mesh);
}

function game_crearCono(name){
  const geometry = new THREE.ConeGeometry(5, 10, 22);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const mesh = new THREE.Mesh(geometry, material);
  game_objectList[name] = mesh;
  game_scene.add(mesh);
}

function game_crearLuzDireccional(name){
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  game_objectList[name] = light;
  game_scene.add(light);
}

function game_crearMesh(name, src){
  game_gltfLoader.load(
    src, 
    function (gltf) {
        const obj = gltf.scene;
        obj.name = name; 
        game_scene.add(obj);
        game_objectList[name] = obj; 
    },
    undefined,
    function (error) {
        console.error("Fallo al cargar el modelo:", error);
    }
  );
}

function game_createAudio(name, src){
    const audio = new Audio(src);
    game_objectList[name] = audio;
}

let game_pyodide;
let game_interruptBuffer;
let game_running = false;

let game_checkInterval = setInterval(() => {
  if (game_pyodide) {
    game_ltxt.innerText = "¡Listo!";
    game_loader.style.transition = "opacity 0.5s ease-out";
    game_loader.style.opacity = 0;
    setTimeout(() => game_loader.style.display = 'none', 500);
    clearInterval(game_checkInterval);
  }
}, 300);

async function game_initPython() {
  game_pyodide = await loadPyodide();
  game_interruptBuffer = new Int32Array(new SharedArrayBuffer(4));
  game_pyodide.setInterruptBuffer(game_interruptBuffer);
}
game_initPython();

async function game_loop() {
  if (!game_running) return;
  try {
    await game_pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    game_running = false;
    Swal.fire({icon: 'error', title: 'Error en Python', text: e});
  }
  requestAnimationFrame(game_loop);
}

async function game_ejecutar() {
  try {
    game_axis.visible = false;
    game_grid.visible = false;

    Atomics.store(game_interruptBuffer, 0, 0);

    game_pyodide.globals.set("create3dPrimitive", (tipo, nombre) => game_crearObjeto(tipo, nombre));
    game_pyodide.globals.set("createAsset3d", (name, src) => game_crearAsset3d("Mesh", name, src));
    game_pyodide.globals.set("move3d", (nombre, x, y, z) => {
      if(game_objectList[nombre]) game_objectList[nombre].position.set(x, y, z);
    });
    game_pyodide.globals.set("rotate3d", (nombre, x, y, z) => {
      if(game_objectList[nombre]) game_objectList[nombre].rotation.set(x, y, z);
    });
    game_pyodide.globals.set("scale3d", (nombre, x, y, z) => {
      if(game_objectList[nombre]) game_objectList[nombre].scale.set(x, y, z);
    });
    game_pyodide.globals.set("toast", (msg) => Swal.fire({ text: msg, toast: true, timer: 2000 }));
    game_pyodide.globals.set("alert", (msg, msgt, iconn) => Swal.fire({ title: msg, text: msgt, icon: iconn }));
    game_pyodide.globals.set("cam3d_set_free", () => game_controls.enabled = true);
    game_pyodide.globals.set("cam3d_set_static", () => game_controls.enabled = false);
    game_pyodide.globals.set("cam3d_set", (x, y, z) => game_camera.position.set(x, y, z));
    game_pyodide.globals.set("cam3d_set_rotation", (x, y, z) => game_camera.rotation.set(x, y, z));
    game_pyodide.globals.set("cam3d_third_person", (obj) => {
      if(game_objectList[obj]) game_controls.target.copy(game_objectList[obj].position);
    });
    game_pyodide.globals.set("drawText", (txt, x, y) => game_ctx.fillText(txt, x, y));
    game_pyodide.globals.set("clear", () => game_ctx.clearRect(0, 0, game_canvas2d.width, game_canvas2d.height));
    game_pyodide.globals.set("drawRect", (x, y, w, h) => game_ctx.fillRect(x, y, w, h));
    game_pyodide.globals.set("setColor", (color) => game_ctx.fillStyle = color);
    game_pyodide.globals.set("drawCircle", (x, y, r) => game_drawCircle(x, y, r));
    game_pyodide.globals.set("setAmbientLight3dColor", (colour) => game_ambientLight.color.set(colour));
    game_pyodide.globals.set("setAmbientLight3dIntensity", (intensityy) => game_ambientLight.intensity = intensityy);
    game_pyodide.globals.set("set3dLightIntensity", (light, intensityy) => {
      if(game_objectList[light]) game_objectList[light].intensity = intensityy;
    });
    game_pyodide.globals.set("set3dLightColor", (light, colour) => {
      if(game_objectList[light]) game_objectList[light].color.set(colour);
    });
    game_pyodide.globals.set("setFont", (font) => game_ctx.font = font);
    game_pyodide.globals.set("show3dAxes", () => game_axis.visible = true);
    game_pyodide.globals.set("hide3dAxes", () => game_axis.visible = false);
    game_pyodide.globals.set("createAudio", (name, src) => game_createAudio(name, src));
    game_pyodide.globals.set("playAudio", (name) => { if(game_objectList[name]) game_objectList[name].play(); });
    game_pyodide.globals.set("stopAudio", (name) => { 
      if(game_objectList[name]) { game_objectList[name].pause(); game_objectList[name].currentTime = 0; }
    });
    game_pyodide.globals.set("pauseAudio", (name) => { if(game_objectList[name]) game_objectList[name].pause(); });
    game_pyodide.globals.set("save", (key, value) => localStorage.setItem(key, value));
    game_pyodide.globals.set("load", (key) => localStorage.getItem(key));
    game_pyodide.globals.set("unsave", (key) => localStorage.removeItem(key));
    game_pyodide.globals.set("screen_touched", () => game_pantallaTocada);
    game_pyodide.globals.set("key_down", (key) => game_teclaTocada === key);

    await game_pyodide.runPythonAsync(game_code);
    game_running = true;
    requestAnimationFrame(game_loop);
  } catch (error) { 
    console.error(error); 
    Swal.fire({icon: 'error', title: 'Error en Python', text: error.message});
  }
}

document.addEventListener("touchstart", () => { game_pantallaTocada = true; });
document.addEventListener("touchend", () => { game_pantallaTocada = false; });
document.addEventListener("keydown", (event) => { game_teclaTocada = event.code; });
document.addEventListener("keyup", () => { game_teclaTocada = null; });

async function game_start() {
  while (!game_pyodide) {
    await new Promise(r => setTimeout(r, 100));
  }
  await game_ejecutar();
}
game_start();

window.addEventListener('resize', () => {
  game_camera.aspect = window.innerWidth / window.innerHeight;
  game_camera.updateProjectionMatrix();
  game_renderer.setSize(window.innerWidth, window.innerHeight);
  game_canvas2d.width = window.innerWidth;
  game_canvas2d.height = window.innerHeight;
});
</script>
</body>
</html>
  `;
  
  const blob = new Blob([template], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = game_name.value + '.html';
  a.click();
  URL.revokeObjectURL(url);
}