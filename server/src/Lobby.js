const generateJoinCode = (length = 6) => {
  const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV123456780`;

  return new Array(length).map(i => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default class Lobby {

  constructor() {
    this.joinCode = generateJoinCode();
    this.players = [];
  }
}