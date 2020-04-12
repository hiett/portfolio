import React from "react";

import * as Styled from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {setRenderResolutionMultiplier} from "../../redux/actions";

const DebugOverlay = () => {
  const dispatch = useDispatch();
  const {frameDeltaTime, deltaTimePhysicsMultiplier, renderResolutionMultiplier} = useSelector(state => state);

  return (
    <Styled.OverlayContainer>
      <h3>HiettDigital Web Engine</h3>
      <p><b>Debug Menu</b></p>
      <br/>
      <p>Minigame Loaded: <Styled.StatusContent>None</Styled.StatusContent></p>
      <p>Frame Delta Time: <Styled.StatusContent>{frameDeltaTime}</Styled.StatusContent></p>
      <p>Physics Multiplier: <Styled.StatusContent>{deltaTimePhysicsMultiplier}</Styled.StatusContent></p>
      <p>Render Resolution: <Styled.StatusContent>{Math.round(renderResolutionMultiplier * 100)}%</Styled.StatusContent>
      </p>
      <Styled.RenderResolutionSlider type="range" min={1} max={100} value={renderResolutionMultiplier * 100}
                                     onChange={e => dispatch(setRenderResolutionMultiplier(parseFloat(e.target.value) / 100))}/>
    </Styled.OverlayContainer>
  );
};

export default DebugOverlay;