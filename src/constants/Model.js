import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {LineBasicMaterial, Mesh} from "three";

const getModel = name => `models/${name.includes(".") ? name : `${name}.obj`}`;

const Model = {
  BOAT: {mesh: getModel("cube"), material: new LineBasicMaterial({color: 0x0000ff})},
};

class CustomModel {

  constructor(modelType, scene) {
    this.modelType = modelType;
    this.ready = false;
    this.object = null;
    this.scene = scene;

    this.handleLoad = this.handleLoad.bind(this);

    this.startLoad();
  }

  startLoad() {
    const extension = this.modelType.mesh.split(".").pop().toLowerCase();

    let loader = null;
    switch (extension) {
      case "obj": {
        loader = new OBJLoader();

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

    loader.load(this.modelType.mesh, this.handleLoad);
  }

  handleLoad(model) {
    model.traverse(child => {
      if (child instanceof Mesh) {
        if (this.modelType.material) {
          child.material = this.modelType.material;
        }

        this.object = model;
        this.ready = true;
      }
    });

    if (this.scene) {
      this.scene.add(model);
    }
  }
}

export {CustomModel};
export default Model;