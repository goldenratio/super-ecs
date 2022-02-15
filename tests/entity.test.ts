import { Component, Entity } from '../src';

const COMPONENT_A = Symbol('COMPONENT_A');
const COMPONENT_B = Symbol('COMPONENT_B');
const COMPONENT_C = Symbol('COMPONENT_C');

class DummyComponent implements Component {
  public name: symbol;
  constructor(name: symbol) {
    this.name = name;
  }
}

describe('Entity', () => {
  it('should have unique id', () => {
    const a = new Entity();
    const b = new Entity();

    expect(a.id).toBe(0);
    expect(b.id).toBe(1);
  });

  it('should return true when checking added components', function () {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity
      .addComponent(CompA)
      .addComponent(CompB)
      .addComponent(CompC);

    expect(entity.hasComponent(COMPONENT_A)).toBe(true);
    expect(entity.hasComponent(COMPONENT_B)).toBe(true);
    expect(entity.hasComponent(COMPONENT_C)).toBe(true);
  });

  it('should return false when checking removed components', function () {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity
      .addComponent(CompA)
      .addComponent(CompB)
      .addComponent(CompC);

    entity
      .removeComponent(COMPONENT_A)
      .removeComponent(COMPONENT_B);

    expect(entity.hasComponent(COMPONENT_A)).toBe(false);
    expect(entity.hasComponent(COMPONENT_B)).toBe(false);
    expect(entity.hasComponent(COMPONENT_C)).toBe(true);
  });

  it('should return the correct component', function () {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity
      .addComponent(CompA)
      .addComponent(CompB)
      .addComponent(CompC);

    expect(entity.getComponent(COMPONENT_A)).toBe(CompA);
    expect(entity.getComponent(COMPONENT_B)).toBe(CompB);
    expect(entity.getComponent(COMPONENT_C)).toBe(CompC);
    expect(entity.getComponent(Symbol('invalid'))).toBeUndefined();
  });

  it('should emit Observables when adding components', function () {

    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    let count = 0;
    const entity = new Entity();
    entity
      .componentAdded$
      .subscribe(() => {
        count ++;
      });

    entity
      .addComponent(CompA)
      .addComponent(CompB)
      .addComponent(CompC);

    expect(count).toBe(3);
  });

  it('should emit signals when removing components', function () {

    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    let count = 0;
    const entity = new Entity();
    entity
      .componentRemoved$
      .subscribe(() => {
        count ++;
      });

    entity
      .addComponent(CompA)
      .addComponent(CompB)
      .addComponent(CompC);

    entity
      .removeComponent(COMPONENT_A)
      .removeComponent(COMPONENT_B);

    // shouldn't throw error for invalid component name
    entity.removeComponent(Symbol('invalid'));

    expect(count).toBe(2);
  });
});
