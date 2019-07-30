import { Component } from '../../src';
import { COMPONENT_NAMES } from './types';

export class SpriteComponent extends Component {

  public sprite: PIXI.Sprite;

  constructor(textureName: string) {
    super(COMPONENT_NAMES.SpriteComponent);
    this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(textureName));
  }
}
