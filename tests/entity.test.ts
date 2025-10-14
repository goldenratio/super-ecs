import { describe, it } from 'node:test';
import assert from 'node:assert';

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

    assert.strictEqual(a.id, 0);
    assert.strictEqual(b.id, 1);
  });

  it('should return true when checking added components', () => {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity.addComponent(CompA).addComponent(CompB).addComponent(CompC);

    assert.strictEqual(entity.hasComponent(COMPONENT_A), true);
    assert.strictEqual(entity.hasComponent(COMPONENT_B), true);
    assert.strictEqual(entity.hasComponent(COMPONENT_C), true);
  });

  it('should return false when checking removed components', () => {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity.addComponent(CompA).addComponent(CompB).addComponent(CompC);

    entity.removeComponent(COMPONENT_A).removeComponent(COMPONENT_B);

    assert.strictEqual(entity.hasComponent(COMPONENT_A), false);
    assert.strictEqual(entity.hasComponent(COMPONENT_B), false);
    assert.strictEqual(entity.hasComponent(COMPONENT_C), true);
  });

  it('should return the correct component', () => {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    const entity = new Entity();
    entity.addComponent(CompA).addComponent(CompB).addComponent(CompC);

    assert.strictEqual(entity.getComponent(COMPONENT_A), CompA);
    assert.strictEqual(entity.getComponent(COMPONENT_B), CompB);
    assert.strictEqual(entity.getComponent(COMPONENT_C), CompC);
    assert.strictEqual(entity.getComponent(Symbol('invalid')), undefined);
  });

  it('should emit Observables when adding components', () => {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    let count = 0;
    const entity = new Entity();

    entity.componentAdded$.subscribe(() => {
      count++;
    });

    entity.addComponent(CompA).addComponent(CompB).addComponent(CompC);

    assert.strictEqual(count, 3);
  });

  it('should emit signals when removing components', () => {
    const CompA = new DummyComponent(COMPONENT_A);
    const CompB = new DummyComponent(COMPONENT_B);
    const CompC = new DummyComponent(COMPONENT_C);

    let count = 0;
    const entity = new Entity();

    entity.componentRemoved$.subscribe(() => {
      count++;
    });

    entity.addComponent(CompA).addComponent(CompB).addComponent(CompC);

    entity.removeComponent(COMPONENT_A).removeComponent(COMPONENT_B);

    // shouldn't throw error for invalid component name
    entity.removeComponent(Symbol('invalid'));

    assert.strictEqual(count, 2);
  });
});
