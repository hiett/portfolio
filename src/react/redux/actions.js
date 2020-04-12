const base = "@HD-WE/";
const HDWEAction = {
  SET_FRAME_DELTA_TIMES: `${base}/SET-FRAME-DELTA-TIME`,
  SET_MINIGAME: `${base}/SET-MINIGAME`,
  SET_RENDER_RESOLUTION_MULTIPLIER: `${base}/SET-RENDER-RESOLUTION-MULTIPLIER`,
};

const setRenderResolutionMultiplier = multiplier => ({
  type: HDWEAction.SET_RENDER_RESOLUTION_MULTIPLIER,
  payload: parseFloat(multiplier),
});

const setMinigame = minigameType => ({
  type: HDWEAction.SET_MINIGAME,
  payload: minigameType,
});

const setFrameDeltaTimes = (deltaTime, physicsMultiplier) => ({
  type: HDWEAction.SET_FRAME_DELTA_TIMES,
  payload: {
    frameDeltaTime: deltaTime,
    deltaTimePhysicsMultiplier: physicsMultiplier,
  },
});

export {HDWEAction, setFrameDeltaTimes, setMinigame, setRenderResolutionMultiplier};