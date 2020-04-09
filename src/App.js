import React, {Component} from 'react';
import {
  AmbientLight,
  DoubleSide,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  WebGLRenderer
} from "three";
import Model, {areAllModelsReady, CustomModel} from "./constants/Model";
import {addInputListeners, updatePlayer} from "./input";

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();

    const testModel = new CustomModel(Model.BOAT, scene);
    testModel.addReadyHook(mesh => {
      // .makeRotationX(Math.PI).

      mesh.applyMatrix(new Matrix4().makeRotationZ(Math.PI / 2));
      // mesh.applyMatrix( new Matrix4().makeRotationZ( Math.PI / 2 ) );
      mesh.translateY(1);
    });

    const geometry = new PlaneGeometry(50, 50, 32);
    const material = new MeshBasicMaterial({color: 0xff0000, side: DoubleSide});
    const plane = new Mesh(geometry, material);
    plane.rotateX(Math.PI / 2);

    const pointLight = new PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 20, 20);
    scene.add(pointLight);

    const light = new AmbientLight(0x404040, 2.5); // soft white light
    scene.add(light);

    scene.add(plane);

    const islandTestModel = new CustomModel(Model.ISLAND1, scene);
    islandTestModel.addReadyHook(mesh => {
      pointLight.lookAt(mesh.position);
    });

    addInputListeners();

    let i = 0;
    setInterval(() => {
      renderer.render(scene, camera);

      if (areAllModelsReady()) {
        // testModel.object.applyMatrix(new Matrix4().makeRotationX(Math.PI / 4));

        // Move this around X and Z
        updatePlayer(testModel.object);

        camera.lookAt(testModel.object.position);

        // light.position.x = testModel.object.position.x;
        // light.position.y = testModel.object.position.y + 10;
        // light.position.z = testModel.object.position.z;
        // light.lookAt(testModel.object.position);

        // testModel.object.translateX(1);

      }
    }, 1000 / 144); // Target FPS
  }

  render() {
    return (
      <></>
    );
  }
}
