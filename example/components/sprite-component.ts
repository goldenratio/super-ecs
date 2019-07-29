import { Component } from '../../src';

export class SpriteComponent extends Component {

  static CNAME = Symbol('SpriteComponent');

  public sprite?: PIXI.Sprite;

  constructor(textureName?: string) {
    super(SpriteComponent.CNAME);
    if (textureName) {
      this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(textureName));
    }
  }
}
