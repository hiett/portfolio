import React, {Component} from 'react';
import {
  AmbientLight,
  BufferGeometry,
  CubeCamera,
  CubicBezierCurve3,
  DirectionalLight,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  TextGeometry,
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

const START_AREA_OFFSET = 250;

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 0);

    // Cube
    var cubeCamera = new CubeCamera(0.1, 1, 512);
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = LinearMipmapLinearFilter;

    const scene = new Scene();

    scene.background = cubeCamera.renderTarget;

    const light = new DirectionalLight(0xffffff, 0.8);
    scene.add(light);

    const waterGeometry = new PlaneBufferGeometry(10000, 10000);

    const water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load('textures/waternormals.jpg', function (texture) {

          texture.wrapS = texture.wrapT = RepeatWrapping;

        }),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      }
    );

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    // Sky
    const sky = new Sky();

    const uniforms = sky.material.uniforms;

    uniforms['turbidity'].value = 10;
    uniforms['rayleigh'].value = 2;
    uniforms['luminance'].value = 1;
    uniforms['mieCoefficient'].value = 0.005;
    uniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
      distance: 400,
      inclination: 0.3055,
      azimuth: 0.2911
    };

    function updateSun() {
      const theta = Math.PI * (parameters.inclination - 0.5);
      const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

      light.position.x = parameters.distance * Math.cos(phi);
      light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
      light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

      sky.material.uniforms['sunPosition'].value = light.position.copy(light.position);
      water.material.uniforms['sunDirection'].value.copy(light.position).normalize();

      cubeCamera.update(renderer, sky);
    }

    updateSun();

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

    const curve = new CubicBezierCurve3(
      new Vector3(-10, 0, 0),
      new Vector3(-5, 15, 0),
      new Vector3(20, 15, 0),
      new Vector3(10, 0, 0)
    );

    const points = curve.getPoints(1000); // Number of FRAMES. FPS x 1000 (ms -> s) x Seconds to run for

    const ambientLight = new AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const titleFont = new CustomFont(Font.POPPINS);
    titleFont.addReadyHook(fontOutput => {
      const text = new CustomText("Scott Hiett", fontOutput, scene);
      const textMesh = text.object;

      textMesh.position.copy(new Vector3(START_AREA_OFFSET, 1, 0));
      textMesh.rotateX(Math.PI / 2);
      textMesh.rotateY(Math.PI);

      camera.position.copy(textMesh.position);
      camera.position.add(new Vector3(0, 75, 0));
      camera.lookAt(textMesh.position);
      camera.rotateZ(Math.PI);
    });

    const textFont = new CustomFont(Font.MONTSERRAT);
    textFont.addReadyHook(fontOutput => {
      const text = new CustomText("maker of things", fontOutput, scene, 1.3);
      const textMesh = text.object;

      textMesh.position.copy(new Vector3(START_AREA_OFFSET, 1, -2));
      textMesh.rotateX(Math.PI / 2);
      textMesh.rotateY(Math.PI);
    });

    const enterKey = new CustomModel(Model.ENTER_KEY, scene);
    enterKey.addReadyHook(mesh => {
      mesh.position.copy(new Vector3(START_AREA_OFFSET + 10, 1, -2));
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

    let i = 0;
    setInterval(() => {
      const deltaTime = (Date.now() - lastFrameTime) / targetTime; // This is number of MS since the last frame.
      lastFrameTime = Date.now();

      water.material.uniforms['time'].value += deltaTime / 100;

      // Camera curve movements
      // if(i !== points.length) {
      //   const point = points[i++];
      //
      //   camera.position.copy(point);
      //   if(areAllModelsReady()) {
      //     camera.lookAt(islands[0].position);
      //   }
      // }

      renderer.render(scene, camera);

      if (areAllModelsReady()) {
        // Move this around X and Z
        updatePlayer(testModel.object);

        // camera.lookAt(testModel.object.position);
      }
    }, 1000 / 144); // Target FPS
  }

  render() {
    return (
      <></>
    );
  }
}
