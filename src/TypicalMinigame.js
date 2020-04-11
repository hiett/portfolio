import Minigame from "./Minigame";

export default class TypicalMinigame extends Minigame {

  constructor(name, mapModel) {
    super(name);

    this.mapModel = mapModel;
  }
}