import { Component, ComponentProps } from '../../src';
import { COMPONENT_NAMES } from './types';

export class PositionComponent implements Component {

  public name: symbol = COMPONENT_NAMES.PositionComponent;
  public x: number;
  public y: number;

  constructor(props?: ComponentProps<PositionComponent>) {
    const { x = 0, y = 0 } = props || {};
    this.x = x;
    this.y = y;
  }
}
