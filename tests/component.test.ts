import { Component } from '../src';

describe('Component', () => {

  it('should check component name', () => {
    const position = Symbol('position');
    const component = new Component(position);
    expect(component.name).toBe(position);
  });
});
