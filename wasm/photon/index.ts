import * as photon from "./lib/photon";
import wasmModule from "./lib/photon_bg.wasm";

photon.initSync(wasmModule);

export * from "./lib/photon";
export { default } from "./lib/photon";
