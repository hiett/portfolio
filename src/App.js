import React, {Component} from 'react';
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Model, {areAllModelsReady, CustomModel} from "./constants/Model";
import {addInputListeners, updatePlayer} from "./input";

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 10, 100);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();

    const testModel = new CustomModel(Model.BOAT, scene);

    addInputListeners();

    setInterval(() => {
      renderer.render(scene, camera);

      if (areAllModelsReady()) {
        // Move this around X and Z
        updatePlayer(testModel.object);

        camera.lookAt(testModel.object.position);

        // testModel.object.translateX(1);

      }
    }, 1000 / 60);
  }

  render() {
    return (
      <></>
    );
  }
}
