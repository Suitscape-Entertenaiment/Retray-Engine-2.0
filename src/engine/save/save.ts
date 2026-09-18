import { editor } from "../code_editor/editor";
import { objectList3d } from "../3d/objects/objects";
import { game_name, ot, oc } from "../main/main";
import { export_type } from "../3d/export/export";

function guardar(){
  let game = {
    code: editor.state.doc.toString(),
    name: game_name.value,
    objects: objectList3d,
    exportType: export_type.value,
    optionalText: ot.value,
    optionalC: oc.value
  };
  
  localStorage.setItem(game_name.value, JSON.stringify(game));
  
  cargarListaJuegos();
}

function cargarListaJuegos() {
    const list = document.getElementById("game_list");
    list.innerHTML = "";
    
    const keys = Object.keys(localStorage);
    
    keys.forEach(key_name => {
      list.innerHTML += `
        <li> 
          <span>${key_name}</span>
          <button class="btn" onclick="abrirJuego('${key_name}')">Open</button>
          <button class="btn" onclick="borrarJuego('${key_name}')">Delete</button>
        </li>
      `;
    });
}
  
function abrirJuego(name: string): void {
  let game = JSON.parse(localStorage.getItem(name));
  editor.setValue(game.code);
  game_name.value = game.name;
  objectList3d = game.objects;
  export_type.value = game.exportType;
  ot.value = game.optionalText;
  oc.value = game.optionalC;
}

function borrarJuego(name: string): void {
  localStorage.removeItem(name);

  cargarListaJuegos();
}

cargarListaJuegos();