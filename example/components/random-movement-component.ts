import { Component, ComponentProps } from '../../src';
import { COMPONENT_NAMES } from './types';

export class RandomMovementComponent implements Component {

  public name: symbol = COMPONENT_NAMES.RandomMovementComponent;
  public speed: number;
  public direction: number;

  constructor(props?: ComponentProps<RandomMovementComponent>) {
    const { speed = 2, direction = 1 } = props || {};
    this.speed = speed;
    this.direction = direction;
  }
}
