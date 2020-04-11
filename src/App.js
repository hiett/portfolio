import React, {Component} from 'react';
import {
  AmbientLight,
  CubeCamera,
  CubicBezierCurve3,
  DirectionalLight,
  LinearMipmapLinearFilter,
  Matrix4,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import Model, {areAllModelsReady, CustomModel} from "./constants/Model";
import {addInputListeners, updatePlayer} from "./input";
import {Water} from "./Water";
import {Sky} from "./Sky";
import {OrbitControls} from "./OrbitControls";
import Font, {CustomFont} from "./constants/Font";
import CustomText from "./constants/CustomText";
import CameraPath from "./camera/CameraPath";
import WaterWorld from "./WaterWorld";

const START_AREA_OFFSET = 250;
const START_CAMERA_Y_OFFSET = 150;

export default class App extends Component {

  componentDidMount() {
    const bezierVectors = [];

    const renderer = new WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 0);

    const scene = new Scene();

    this.waterWorld = new WaterWorld(scene, renderer);

    const ISLAND_SPREAD = 100;
    const ISLAND_SCALE = 10;

    const islands = [];
    for (let i = 0; i < 1; i++) {
      const island = new CustomModel(Model[`SMALL_ISLAND_${Math.random() > 0.5 ? 1 : 2}`], scene);
      const pointLight = new PointLight(0xffffff, 1, 15);

      island.addReadyHook(mesh => {
        mesh.position.x = ISLAND_SPREAD * Math.random() + 20;
        mesh.position.z = ISLAND_SPREAD * Math.random() + 20;
        mesh.position.y = ISLAND_SCALE * -2;

        mesh.scale.set(ISLAND_SCALE, ISLAND_SCALE, ISLAND_SCALE);
        mesh.rotateY(Math.PI * Math.random());

        pointLight.position.set(mesh.position.x, mesh.position.y + 25, mesh.position.z);
        pointLight.lookAt(mesh.position);
        scene.add(pointLight);

        islands.push(mesh);
      });
    }

    const testModel = new CustomModel(Model.BOAT, scene);
    testModel.addReadyHook(mesh => {
      mesh.applyMatrix(new Matrix4().makeRotationZ(Math.PI / 2));
      // mesh.applyMatrix(new Matrix4().makeTranslation(0, -0.1, 0));
    });

    let points = [];

    const ambientLight = new AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const titleFont = new CustomFont(Font.POPPINS);
    titleFont.addReadyHook(fontOutput => {
      const text = new CustomText("Scott Hiett", fontOutput, scene);
      const textMesh = text.object;

      textMesh.position.copy(new Vector3(START_AREA_OFFSET, START_CAMERA_Y_OFFSET, 0));
      textMesh.rotateX(Math.PI / 2);
      textMesh.rotateY(Math.PI);

      camera.position.copy(textMesh.position);
      camera.position.add(new Vector3(0, START_CAMERA_Y_OFFSET / 2, 0));
      camera.lookAt(textMesh.position);
      camera.rotateZ(Math.PI);

      bezierVectors.push(new Vector3().copy(camera.position));
      bezierVectors.push(new Vector3().copy(textMesh.position));
      bezierVectors.push(new Vector3().copy(textMesh.position));
    });

    const textFont = new CustomFont(Font.MONTSERRAT);
    textFont.addReadyHook(fontOutput => {
      const text = new CustomText("maker of things", fontOutput, scene, 1.3);
      const textMesh = text.object;

      textMesh.position.copy(new Vector3(START_AREA_OFFSET, START_CAMERA_Y_OFFSET, -2));
      textMesh.rotateX(Math.PI / 2);
      textMesh.rotateY(Math.PI);
    });

    const enterKey = new CustomModel(Model.ENTER_KEY, scene);
    enterKey.addReadyHook(mesh => {
      mesh.position.copy(new Vector3(START_AREA_OFFSET + 13, START_CAMERA_Y_OFFSET, -2));
      mesh.rotateY(Math.PI);
    });

    addInputListeners();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    let lastFrameTime = Date.now();
    const targetTime = 1000 / 60;

    let runningCameraAnimation = false;

    let i = 0;
    setInterval(() => {
      const deltaTime = (Date.now() - lastFrameTime) / targetTime; // This is number of MS since the last frame.
      lastFrameTime = Date.now();

      this.waterWorld.water.material.uniforms['time'].value += deltaTime / 100;

      // Camera curve movements
      // if (runningCameraAnimation && i !== points.length) {
      //   const point = points[i++];
      //
      //   camera.position.copy(point);
      //   // if(areAllModelsReady()) {
      //   //   camera.lookAt(islands[0].position);
      //   // }
      // }

      CameraPath.runPathUpdatesTick();

      renderer.render(scene, camera);

      if (areAllModelsReady()) {
        // Move this around X and Z
        updatePlayer(testModel.object);

        // camera.lookAt(testModel.object.position);
      }
    }, 1000 / 144); // Target FPS

    window.addEventListener("resize", event => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    window.addEventListener("keyup", event => {
      const {keyCode} = event;

      switch (keyCode) {
        case 13: {
          bezierVectors.push(new Vector3(camera.position.x + 50, 2, camera.position.z));

          this.introCameraPathAnimation = new CameraPath(camera, bezierVectors, [
            // new Vector3().copy(camera.position),
            new Vector3(camera.position.x, 2, camera.position.z),
            new Vector3(camera.position.x + 50, 2, camera.position.z),
          ], true, null, camera => {
            console.log("Frame modifier");
            camera.rotateZ(-Math.PI / 2);
          });
          this.introCameraPathAnimation.start();

          break;
        }
      }
    });
  }

  render() {
    return (
      <></>
    );
  }
}
