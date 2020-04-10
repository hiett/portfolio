import {FontLoader} from "three";

const getFont = font => `fonts/${font}.json`;

const Font = {
  POPPINS: getFont("Poppins"),
  MONTSERRAT: getFont("Montserrat"),
};

export class CustomFont {

  constructor(fontType) {
    this.fontType = fontType;
    this.readyHooks = [];
    this.ready = false;
    this.font = null;

    this.handleLoad = this.handleLoad.bind(this);

    this.startLoad();
  }

  addReadyHook(hook) {
    if (this.ready) {
      hook(this.font);

      return;
    }

    this.readyHooks.push(hook);
  }

  startLoad() {
    const loader = new FontLoader();
    loader.load(this.fontType, this.handleLoad);
  }

  handleLoad(font) {
    this.font = font;
    this.ready = true;

    this.readyHooks.forEach(hook => hook(font));
  }
}

export default Font;