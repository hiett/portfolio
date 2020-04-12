import React from "react";
import DebugOverlay from "../DebugOverlay";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import WaterWorld from "../../../WaterWorld";
import CameraPath from "../../../camera/CameraPath";
import {setFrameDeltaTimes} from "../../redux/actions";
import {connect} from "react-redux";
import Minigame, {MinigameTypeMappings} from "../../../Minigame";
import {OrbitControls} from "../../../OrbitControls";

const FRAME_MULTIPLIER_TARGET_TIME = 1000 / 60;

class GameRenderer extends React.Component {

  constructor(props) {
    super(props);

    this.gameRender = this.gameRender.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);

    this.minigameRunning = false;
  }

  componentDidMount() {
    this.minigame = MinigameTypeMappings[this.props.minigame] || new Minigame("No Minigame");

    this.renderer = new WebGLRenderer({antialias: true, alpha: true, canvas: this.canvas});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(0, 0, 0);

    this.scene = new Scene();

    this.waterWorld = new WaterWorld(this.scene, this.renderer);

    this.minigameRunning = true;
    this.minigame.start();

    const controls = new OrbitControls(this.camera, this.canvas);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    // Frame delta times
    this.lastFrameTime = Date.now();
    this.lastFrameTimeVisualUpdate = 0;
    requestAnimationFrame(this.gameRender);

    this.addEventListeners();
  }

  componentWillUnmount() {
    this.minigameRunning = false;

    // Cleanup
    this.minigame.stop();

    this.removeEventListeners();
  }

  addEventListeners() {
    window.addEventListener("resize", this.resizeHandler);
  }

  removeEventListeners() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  resizeHandler() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  gameRender() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const physicsMultiplier = deltaTime / FRAME_MULTIPLIER_TARGET_TIME;

    this.lastFrameTime = currentTime;

    if (this.lastFrameTimeVisualUpdate + 1000 < Date.now()) {
      // Dispatch this
      this.props.dispatch(setFrameDeltaTimes(deltaTime + "ms", physicsMultiplier));

      this.lastFrameTimeVisualUpdate = currentTime;
    }

    this.waterWorld.water.material.uniforms['time'].value += physicsMultiplier / 100;

    CameraPath.runPathUpdatesTick();

    this.minigame.renderHook();
    this.renderer.render(this.scene, this.camera);

    if (this.minigameRunning) {
      requestAnimationFrame(this.gameRender);
    }
  }

  render() {
    const {renderResolutionMultiplier} = this.props;

    if (this.renderer) {
      this.renderer.setSize(window.innerWidth * renderResolutionMultiplier, window.innerHeight * renderResolutionMultiplier);
    }

    return (
      <>
        <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
          <div style={{
            transform: `scale(${window.innerWidth / (window.innerWidth * renderResolutionMultiplier)})`,
            transformOrigin: "top left"
          }}>
            <canvas ref={ref => this.canvas = ref}/>
          </div>
        </div>
        <DebugOverlay/>
      </>
    );
  }
}

export default connect(state => ({renderResolutionMultiplier: state.renderResolutionMultiplier}))(GameRenderer);