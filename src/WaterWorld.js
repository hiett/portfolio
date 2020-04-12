import {
  CubeCamera,
  DirectionalLight,
  LinearMipmapLinearFilter,
  PlaneBufferGeometry,
  RepeatWrapping,
  TextureLoader
} from "three";
import {Water} from "three/examples/jsm/objects/Water";
import {Sky} from "three/examples/jsm/objects/Sky";

export default class WaterWorld {

  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;

    this.light = new DirectionalLight(0xffffff, 0.8);
    this.scene.add(this.light);

    this.createWater();
    this.createSky();
  }

  createSky() {
    // Cube
    const cubeCamera = new CubeCamera(0.1, 1, 512);
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = LinearMipmapLinearFilter;

    this.scene.background = cubeCamera.renderTarget;

    // Sky
    this.sky = new Sky();

    const uniforms = this.sky.material.uniforms;

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

    const theta = Math.PI * (parameters.inclination - 0.5);
    const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    this.light.position.x = parameters.distance * Math.cos(phi);
    this.light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    this.light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

    this.sky.material.uniforms['sunPosition'].value = this.light.position.copy(this.light.position);
    this.water.material.uniforms['sunDirection'].value.copy(this.light.position).normalize();

    cubeCamera.update(this.renderer, this.sky);
  }

  createWater() {
    const waterGeometry = new PlaneBufferGeometry(10000, 10000);

    this.water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load('textures/waternormals.jpg', function (texture) {

          texture.wrapS = texture.wrapT = RepeatWrapping;

        }),
        alpha: 1.0,
        sunDirection: this.light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined
      }
    );

    this.water.rotation.x = -Math.PI / 2;

    this.scene.add(this.water);
  }
}