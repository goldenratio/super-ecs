import { Component } from '../../src';

export class PositionComponent extends Component {

  static CNAME = Symbol('PositionComponent');

  public x: number = 0;
  public y: number = 0;

  constructor(props = { x: 0, y: 0 }) {
    super(PositionComponent.CNAME);
    this.x = props.x;
    this.y = props.y;
  }
}
