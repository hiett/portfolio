import Lobby from "./Lobby";

export default class GameServer {

  constructor() {
    this.lobbies = [];

    this.lobbies.push(new Lobby());
    console.log(this.lobbies[0].joinCode);
  }
}