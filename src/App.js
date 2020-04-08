import React, {Component} from 'react';
import {LineBasicMaterial, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();

    const material = new LineBasicMaterial({color: 0x0000ff});

    const loader = new OBJLoader();
    let teapot;
    loader.load('models/teapot.obj', function (model) {

      model.traverse(function (child) {
        if (child instanceof Mesh) {
          child.material = material;

          teapot = child;
        }
      });

      scene.add(model);
    });

    setInterval(() => {
      renderer.render(scene, camera);

      if (teapot) {
        teapot.rotateY(0.1);
        teapot.rotateX(0.1);
        teapot.rotateZ(0.1);
      }
    }, 1000 / 30);
  }

  render() {
    return (
      <></>
    );
  }
}
