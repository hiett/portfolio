import {CubicBezierCurve3, Line3, Vector3} from "three";

const cameraPaths = [];
const DIVISIONS = 1000;

export default class CameraPath {

  constructor(camera, movementPoints, trackingPoints, loop = false, divisions = DIVISIONS, frameModifier = null) {
    this.camera = camera;
    this.movementPoints = movementPoints;
    this.trackingPoints = trackingPoints;
    this.divisions = divisions || DIVISIONS;
    this.loop = loop;
    this.frame = 0;
    this.frameModifier = frameModifier;
    this.onEndHooks = [];

    this.playing = false;
    this._update = this._update.bind(this);

    this.createPaths();

    cameraPaths.push(this);
  }

  static runPathUpdatesTick() {
    cameraPaths.forEach(path => path._update());
  }

  addOnEndHook(hook) {
    this.onEndHooks.push(hook);
  }

  createPaths() {
    const curve = new CubicBezierCurve3(
      ...this.movementPoints,
    );
    this._movementPoints = curve.getPoints(this.divisions); // Number of FRAMES. FPS x 1000 (ms -> s) x Seconds to run for

    const line = new Line3(this.trackingPoints[0], this.trackingPoints[1]);
    this._trackingPoints = [];
    for (let i = 0; i < this.divisions; i++) {
      const vector = new Vector3();
      line.at(1 / this.divisions * i, vector);

      this._trackingPoints.push(vector);
    }
  }

  start() {
    this.frame = 0;
    this.playing = true;

    console.log("Starting camera animation.");
  }

  stop() {
    this.playing = false;

    this.onEndHooks.forEach(hook => hook());
  }

  _update() {
    if (!this.playing) {
      return;
    }

    if (this.frame === this.divisions - 1) {
      if (this.loop) {
        this.frame = 0;
      } else {
        this.stop();

        return;
      }
    }

    this.frame++;

    const movement = this._movementPoints[this.frame];
    const tracking = this._trackingPoints[this.frame];

    if (!movement || !tracking) {
      console.log("NOT MOVEMENT OR TRACKING.");

      return;
    }

    this.camera.position.copy(movement);
    this.camera.lookAt(tracking);

    if (this.frameModifier) {
      this.frameModifier(this.camera);
    }
  }
}