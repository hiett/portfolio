import {Vector3} from "three";

const moveSpeed = 1;
const angularSpeed = 0.01;
const playerSpeed = 0.075;
const playerBackwardsSpeed = playerSpeed * 0.4;

let direction = 0;
let directionVector = new Vector3(0, 0, 0);

const moving = {
  forwards: false,
  backwards: false,
  rotatingLeft: false,
  rotatingRight: false,
};

const KEY_MAPPINGS = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
};

const handleKey = (event, state = false) => {
  console.log(event);

  switch (event.keyCode) {
    case KEY_MAPPINGS.W: {
      moving.forwards = state;

      break;
    }
    case KEY_MAPPINGS.A: {
      moving.rotatingLeft = state;

      break;
    }
    case KEY_MAPPINGS.D: {
      moving.rotatingRight = state;

      break;
    }
    case KEY_MAPPINGS.S: {
      moving.backwards = state;

      break;
    }
    default: {
      break;
    }
  }
};

const moveForward = (speed, mesh) => {
  const delta_x = speed * Math.cos(direction);
  const delta_z = speed * Math.sin(direction);
  const new_x = mesh.position.x + delta_x;
  const new_z = mesh.position.z + delta_z;
  mesh.position.x = new_x;
  mesh.position.z = new_z;

  const new_dx = directionVector.x + delta_x;
  const new_dz = directionVector.z + delta_z;
  directionVector.x = new_dx;
  directionVector.z = new_dz;

  mesh.lookAt(directionVector);
};

const setPlayerDirection = mesh => {
  const delta_x = playerSpeed * Math.cos(direction);
  const delta_z = playerSpeed * Math.sin(direction);

  const new_dx = mesh.position.x + delta_x;
  const new_dz = mesh.position.z + delta_z;
  directionVector.x = new_dx;
  directionVector.z = new_dz;

  mesh.setRotationFromAxisAngle(directionVector, direction);
  mesh.lookAt(directionVector);
};

let lastTime = Date.now();
const targetTime = 1000 / 60;

const updatePlayer = camera => {
  const deltaTime = (Date.now() - lastTime) / targetTime; // This is number of MS since the last frame.
  lastTime = Date.now();

  if (moving.rotatingLeft) {
    direction -= angularSpeed * deltaTime;
  }
  if (moving.rotatingRight) {
    direction += angularSpeed * deltaTime;
  }
  if (moving.rotatingRight || moving.rotatingLeft) {
    setPlayerDirection(camera);
  }

  if (moving.forwards) {
    moveForward(playerSpeed * deltaTime, camera);

  }
  if (moving.backwards) {
    moveForward(-playerBackwardsSpeed * deltaTime, camera);
  }
};

// Add the event listener
const addInputListeners = () => {
  window.addEventListener("keydown", event => handleKey(event, true));
  window.addEventListener("keyup", event => handleKey(event, false));
};

export {addInputListeners, updatePlayer};