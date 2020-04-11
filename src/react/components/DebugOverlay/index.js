import React from "react";

import * as Styled from "./styles";
import {useSelector} from "react-redux";

const DebugOverlay = () => {
  const {frameDeltaTime, deltaTimePhysicsMultiplier} = useSelector(state => state);

  return (
    <Styled.OverlayContainer>
      <h3>HiettDigital Web Engine</h3>
      <p><b>Debug Menu</b></p>
      <br/>
      <p>Minigame Loaded: <Styled.StatusContent>None</Styled.StatusContent></p>
      <p>Frame Delta Time: <Styled.StatusContent>{frameDeltaTime}</Styled.StatusContent></p>
      <p>Physics Multiplier: <Styled.StatusContent>{deltaTimePhysicsMultiplier}</Styled.StatusContent></p>
    </Styled.OverlayContainer>
  );
};

export default DebugOverlay;