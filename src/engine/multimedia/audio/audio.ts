import { audioList } from "../multimedia";

function createAudio(name: string, src: string): void {
    const audio = new Audio(src);
    audioList[name] = audio;
}

export { createAudio };