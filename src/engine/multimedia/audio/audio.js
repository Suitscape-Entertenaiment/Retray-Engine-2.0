import { audioList } from "../multimedia";
function createAudio(name, src) {
    const audio = new Audio(src);
    audioList[name] = audio;
}
export { createAudio };
//# sourceMappingURL=audio.js.map