import React from "react";

const base = "@HD-WE/";
const HDWEAction = {
  SET_FRAME_DELTA_TIMES: `${base}/SET-FRAME-DELTA-TIME`,
};

const setFrameDeltaTimes = (deltaTime, physicsMultiplier) => ({
  type: HDWEAction.SET_FRAME_DELTA_TIMES,
  payload: {
    frameDeltaTime: deltaTime,
    deltaTimePhysicsMultiplier: physicsMultiplier,
  },
});

export {HDWEAction, setFrameDeltaTimes};