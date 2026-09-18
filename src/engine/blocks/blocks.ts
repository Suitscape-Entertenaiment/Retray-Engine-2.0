import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/python';
import { mode } from '../main/main';

let toolbox: Blockly.utils.toolbox.ToolboxDefinition;
let workspace: Blockly.WorkspaceSvg;
let blocks_code_generated: string;

if (mode == "blocks") {
  toolbox = {
    kind: 'flyoutToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Events',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'on_start' }
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
  ],
};

workspace = Blockly.inject('blocks_editor', {
  toolbox,
  renderer: 'zelos',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.8,
    maxScale: 3,
    minScale: 0.3,
  },
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true,
  },
});

Blockly.defineBlocksWithJsonArray([
  {
    "type": "crear_obj",
    "message0": "crear %1 con id : %2",
    "args0": [
      { 
        "type": "field_dropdown", 
        "name": "create_type", 
        "options": [["cubo", "cubo"], ["cono", "cono"]] 
      },
      {
        "type": "input_value",
        "name": "id_obj",
        "check": "String"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 1
  },
  {
    "type": "al_iniciar",
    "message0": "On Init",
    "nextStatement": null,
    "colour": 180
  },
  {
    "type": "cambiar_eje",
    "message0": "change %1 of %2 to %3",
    "args0":[
      {
        "type": "field_dropdown",
        "name": "eje_a_cambiar",
        "options" : [
          ["x", "x"],
          ["y", "y"],
          ["z", "z"]
        ]
      },
      {
        "type": "input_value",
        "name": "id_obj",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "valor_eje_cambiar",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": true,
    "colour": 1
  },{
  "type": "forever",
  "message0": "forever %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "Repite para siempre"
},{
  "type": "start",
  "message0": "inicio",
  "nextStatement": null,
  "colour": 160,
  "deletable": false
},{
  "type": "end",
  "message0": "fin",
  "previousStatement": null,
  "colour": 20
}
]);

(Blockly as any).Python['al_iniciar'] = function(block: Blockly.Block) {
  const code = `# Game Init \n`;
  return code;
}

blocks_code_generated = (Blockly as any).Python.workspaceToCode(workspace);
}

export { workspace, blocks_code_generated };