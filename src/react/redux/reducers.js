import React from "react";
import {HDWEAction} from "./actions";

const defaultState = {
  frameDeltaTime: 0,
  deltaTimePhysicsMultiplier: 0,
};

function reducer(state = defaultState, action) {
  switch(action.type) {
    case HDWEAction.SET_FRAME_DELTA_TIMES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
}

export default reducer;