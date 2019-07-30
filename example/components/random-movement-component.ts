import { Component } from '../../src';
import { COMPONENT_NAMES } from './types';

interface Props {
  readonly speed?: number;
  readonly direction?: number;
}

export class RandomMovementComponent extends Component {

  public speed: number;
  public direction: number;

  constructor(props?: Props) {
    super(COMPONENT_NAMES.RandomMovementComponent);
    const { speed = 2, direction = 1 } = props || {};
    this.speed = speed;
    this.direction = direction;
  }
}
