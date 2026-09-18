import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { initPython, mode } from "../main/main";

let editor: EditorView;

if (mode === "code") {
  document.addEventListener("DOMContentLoaded", () => {
    const parent = document.getElementById("code-editor");

    editor = new EditorView({
      doc: "",
      extensions: [
        basicSetup,
        python(),
        oneDark,
      ],
      parent: parent!
    });

    initPython();
  });
}

export { editor };