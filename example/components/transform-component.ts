import { Component } from '../../src';

interface Props {
  readonly x?: number;
  readonly y?: number;
  readonly speed?: number;
  readonly direction?: number;
}

export class TransformComponent extends Component {

  static CNAME = Symbol('TransformComponent');

  public x: number;
  public y: number;
  public speed: number;
  public direction: number;

  constructor(props?: Props) {
    super(TransformComponent.CNAME);
    const { x = 0, y = 0, speed = 2, direction = 1 } = props || {};
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.direction = direction;
  }
}
