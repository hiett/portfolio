import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {Mesh} from "three";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

const getModel = name => `models/${name.includes(".") ? name : `${name}.obj`}`;
const getDir = name => ({mesh: `models/${name}/${name}.obj`, materialUrl: `models/${name}/${name}.mtl`});

const Model = {
  BOAT: getDir("Boat"), // {mesh: getModel("boat"), material: new LineBasicMaterial({color: 0x0000ff})}
  ISLAND1: getDir("Island1"),
  SMALL_ISLAND_1: getDir("SmallIsland1"),
  SMALL_ISLAND_2: getDir("SmallIsland2"),
};

const modelStore = [];

// Cache this response
let modelsReady = false;
// This only works for initial load. Retro-added models won't count here.
const areAllModelsReady = () => {
  if (modelsReady)
    return true;

  if (modelStore.filter(model => !model.ready).length === 0) {
    modelsReady = true;

    return true;
  }

  return false;
};

class CustomModel {

  constructor(modelType, scene) {
    this.modelType = modelType;
    this.ready = false;
    this.object = null;
    this.material = null;
    this.scene = scene;
    this.readyHooks = [];

    this.handleLoadObject = this.handleLoadObject.bind(this);
    this.handleLoadMaterial = this.handleLoadMaterial.bind(this);

    this.startLoad();

    modelStore.push(this);
  }

  addReadyHook(callback) {
    if (this.ready) {
      callback(this.object);

      return;
    }

    this.readyHooks.push(callback);
  }

  startLoad() {
    const extension = this.modelType.mesh.split(".").pop().toLowerCase();

    let loader = null;
    let materialLoader = null;
    switch (extension) {
      case "obj": {
        loader = new OBJLoader();
        materialLoader = new MTLLoader();

        break;
      } // ...more will be added as needed
      default: {
        break;
      }
    }

    if (!loader) {
      console.error(`No loader found for model ${this.modelType.mesh}`);
      return;
    }

    if (this.modelType.materialUrl && materialLoader) {
      console.log("Using material loader.");
      this._loader = loader;
      materialLoader.load(this.modelType.materialUrl, this.handleLoadMaterial);
    } else {
      loader.load(this.modelType.mesh, this.handleLoadObject);
    }
  }

  handleLoadMaterial(materials) {
    materials.preload();

    this._loader.setMaterials(materials);
    this._loader.load(this.modelType.mesh, this.handleLoadObject);
  }

  handleLoadObject(model) {
    model.traverse(child => {
      if (child instanceof Mesh) {
        if (this.modelType.material) {
          this.material = this.modelType.material;
        }

        if (this.material) {
          child.material = this.material;
        }

        this.object = model;
        this.ready = true;
      }
    });

    if (this.scene) {
      this.scene.add(model);
    }

    this.readyHooks.forEach(hook => hook(this.object));
  }
}

export {CustomModel, areAllModelsReady};
export default Model;