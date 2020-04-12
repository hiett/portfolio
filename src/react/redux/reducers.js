import React from "react";
import {HDWEAction} from "./actions";

const defaultState = {
  frameDeltaTime: 0,
  deltaTimePhysicsMultiplier: 0,
  minigame: null,
  renderResolutionMultiplier: 1,
};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case HDWEAction.SET_RENDER_RESOLUTION_MULTIPLIER:
      return {
        ...state,
        renderResolutionMultiplier: action.payload,
      };
    case HDWEAction.SET_FRAME_DELTA_TIMES:
      return {
        ...state,
        ...action.payload,
      };
    case HDWEAction.SET_MINIGAME:
      return {
        ...state,
        minigame: action.payload,
      };
    default:
      return {...state};
  }
}

export default reducer;