import React, {Component} from 'react';
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import Model, {CustomModel} from "./constants/Model";

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();

    const testModel = new CustomModel(Model.BOAT, scene);

    setInterval(() => {
      renderer.render(scene, camera);

      if (testModel.ready) {
        testModel.object.rotateY(0.1);
        testModel.object.rotateX(0.1);
        testModel.object.rotateZ(0.1);
      }
    }, 1000 / 60);
  }

  render() {
    return (
      <></>
    );
  }
}
