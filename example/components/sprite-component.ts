import { Component, ComponentProps } from '../../src';
import { COMPONENT_NAMES } from './types';

export class SpriteComponent implements Component {

  public name: symbol = COMPONENT_NAMES.SpriteComponent;
  public sprite: PIXI.Sprite;

  constructor(props?: ComponentProps<SpriteComponent>) {
    const { sprite = new PIXI.Sprite() } = props || {};
    this.sprite = sprite;
  }
}
