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
  WebGLRenderer,
  PlaneBufferGeometry,
  TextureLoader,
  RepeatWrapping,
  DirectionalLight,
  CubeCamera,
  LinearMipmapLinearFilter,
} from "three";
import Model, {areAllModelsReady, CustomModel} from "./constants/Model";
import {addInputListeners, updatePlayer} from "./input";
import {Water} from "./Water";
import {Sky} from "./Sky";
import {OrbitControls} from "./OrbitControls";

export default class App extends Component {

  componentDidMount() {
    const renderer = new WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(20, 30, 20);
    camera.lookAt(0, 25, 0);

    // Cube
    var cubeCamera = new CubeCamera( 0.1, 1, 512 );
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = LinearMipmapLinearFilter;

    const scene = new Scene();

    scene.background = cubeCamera.renderTarget;

    const light = new DirectionalLight( 0xffffff, 0.8 );
    scene.add( light );

    const waterGeometry = new PlaneBufferGeometry( 10000, 10000 );

    const water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

          texture.wrapS = texture.wrapT = RepeatWrapping;

        } ),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add(water);

    // Sky
    const sky = new Sky();

    const uniforms = sky.material.uniforms;

    uniforms[ 'turbidity' ].value = 10;
    uniforms[ 'rayleigh' ].value = 2;
    uniforms[ 'luminance' ].value = 1;
    uniforms[ 'mieCoefficient' ].value = 0.005;
    uniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
      distance: 400,
      inclination: 0.3055,
      azimuth: 0.2911
    };

    function updateSun() {

      var theta = Math.PI * ( parameters.inclination - 0.5 );
      var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

      light.position.x = parameters.distance * Math.cos( phi );
      light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
      light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );

      sky.material.uniforms[ 'sunPosition' ].value = light.position.copy( light.position );
      water.material.uniforms[ 'sunDirection' ].value.copy( light.position ).normalize();

      cubeCamera.update( renderer, sky );

    }

    updateSun();

    const ISLAND_SPREAD = 40;
    const ISLAND_SCALE = 2;

    const islands = [];
    for(let i = 0; i < 3; i++) {
      const island = new CustomModel(Model[`SMALL_ISLAND_${Math.random() > 0.5 ? 1 : 2}`], scene);
      const pointLight = new PointLight(0xffffff, 1, 15);

      island.addReadyHook(mesh => {
        // mesh.setScale(2, 2, 2);

        mesh.position.x = ISLAND_SPREAD * Math.random();
        mesh.position.z = ISLAND_SPREAD * Math.random();
        mesh.position.y = -4.1;

        mesh.scale.set(ISLAND_SCALE, ISLAND_SCALE, ISLAND_SCALE);
        mesh.rotateY(Math.PI * Math.random());

        pointLight.position.set(mesh.position.x, mesh.position.y + 25, mesh.position.z);
        pointLight.lookAt(mesh.position);
        scene.add(pointLight);

        camera.lookAt(mesh.position);

        islands.push(mesh);
      });
    }
    const testModel = new CustomModel(Model.BOAT, scene);
    testModel.addReadyHook(mesh => {
      // .makeRotationX(Math.PI).

      mesh.applyMatrix(new Matrix4().makeRotationZ(Math.PI / 2));
      // mesh.applyMatrix( new Matrix4().makeRotationZ( Math.PI / 2 ) );
      mesh.translateY(1);
    });

    // const geometry = new PlaneGeometry(50, 50, 32);
    // const material = new MeshBasicMaterial({color: 0xff0000, side: DoubleSide});
    // const plane = new Mesh(geometry, material);
    // scene.add(plane);
    // plane.rotateX(Math.PI / 2);

    // const light = new AmbientLight(0x404040); // soft white light
    // scene.add(light);

    addInputListeners();

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    let lastFrameTime = Date.now();
    const targetTime = 1000 / 60;

    setInterval(() => {
      const deltaTime = (Date.now() - lastFrameTime) / targetTime; // This is number of MS since the last frame.
      lastFrameTime = Date.now();

      water.material.uniforms[ 'time' ].value += deltaTime / 100;

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
