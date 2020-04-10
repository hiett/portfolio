import {BufferGeometry, Mesh, MeshPhongMaterial, TextGeometry} from "three";

export default class CustomText {

  constructor(content, font, scene, size) {
    this.content = content;
    this.font = font;
    this.object = null;
    this.scene = scene;
    this.size = size || 2;

    this.build();
  }

  build() {
    const text = new TextGeometry(this.content, {
      size: this.size,
      height: 1,
      font: this.font,
    });

    text.computeBoundingBox();
    text.computeVertexNormals();
    const textGeo = new BufferGeometry().fromGeometry(text);
    this.object = new Mesh(textGeo, new MeshPhongMaterial({color: 0xffffff, flatShading: true}));

    if(this.scene) {
      this.scene.add(this.object);
    }
  }
}