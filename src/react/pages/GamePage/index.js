import React from "react";
import GameRenderer from "../../components/GameRenderer";
import {useSelector} from "react-redux";

const GamePage = () => {
  const minigame = useSelector(state => state.minigame);

  return <GameRenderer minigame={minigame}/>;
};

export default GamePage;