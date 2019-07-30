import { Component } from '../../src';
import { COMPONENT_NAMES } from './types';

interface Props {
  readonly x?: number;
  readonly y?: number;
}

export class PositionComponent extends Component {

  public x: number;
  public y: number;

  constructor(props?: Props) {
    super(COMPONENT_NAMES.PositionComponent);
    const { x = 0, y = 0 } = props || {};
    this.x = x;
    this.y = y;
  }
}
