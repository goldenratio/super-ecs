import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Component, Entity, World } from '../src';

class DummyComponent implements Component {
  public name: symbol;
  constructor(name: symbol) {
    this.name = name;
  }
}

const COMPONENT_NAMES = {
  CompA: Symbol('CompA'),
  CompB: Symbol('CompB'),
  CompC: Symbol('CompC'),
  CompD: Symbol('CompD'),
};

function createEntityA() {
  const compA = new DummyComponent(COMPONENT_NAMES.CompA);
  const compB = new DummyComponent(COMPONENT_NAMES.CompB);
  const compC = new DummyComponent(COMPONENT_NAMES.CompC);

  const entity = new Entity();
  entity.addComponent(compA).addComponent(compB).addComponent(compC);
  return entity;
}

function createEntityB() {
  const compA = new DummyComponent(COMPONENT_NAMES.CompA);
  const compB = new DummyComponent(COMPONENT_NAMES.CompB);

  const entity = new Entity();
  entity.addComponent(compA).addComponent(compB);
  return entity;
}

function createEntityC() {
  const compA = new DummyComponent(COMPONENT_NAMES.CompA);
  const compC = new DummyComponent(COMPONENT_NAMES.CompC);

  const entity = new Entity();
  entity.addComponent(compA).addComponent(compC);
  return entity;
}

describe('World', () => {
  it('should get correct entities for each family', () => {
    const world = new World();

    Array.from({ length: 100 }).forEach(() => {
      const entity = createEntityA();
      world.addEntity(entity);
    });

    Array.from({ length: 100 }).forEach(() => {
      const entity = createEntityB();
      world.addEntity(entity);
    });

    Array.from({ length: 100 }).forEach(() => {
      const entity = createEntityC();
      world.addEntity(entity);
    });

    assert.strictEqual(world.getEntities([COMPONENT_NAMES.CompA]).length, 300);
    assert.strictEqual(world.getEntities([COMPONENT_NAMES.CompB]).length, 200);
    assert.strictEqual(world.getEntities([COMPONENT_NAMES.CompC]).length, 200);

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
      ]).length,
      100,
    );

    assert.strictEqual(
      world.getEntities([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).length,
      200,
    );

    assert.strictEqual(
      world.getEntities([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompC]).length,
      200,
    );

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
        COMPONENT_NAMES.CompD,
      ]).length,
      0,
    );
  });

  it('should update entity-family relationship when adding components', () => {
    const world = new World();
    let entity: Entity = new Entity();

    Array.from({ length: 100 }).forEach(() => {
      entity = createEntityB();
      world.addEntity(entity);
    });

    assert.strictEqual(
      world.getEntities([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).length,
      100,
    );

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
      ]).length,
      0,
    );

    const compC = new DummyComponent(COMPONENT_NAMES.CompC);
    entity.addComponent(compC);

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
      ]).length,
      1,
    );
  });

  it('should update entity-family relationship when removing components', () => {
    const world = new World();
    let entity: Entity = new Entity();

    Array.from({ length: 100 }).forEach(() => {
      entity = createEntityA();
      world.addEntity(entity);
    });

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
      ]).length,
      100,
    );

    assert.strictEqual(
      world.getEntities([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).length,
      100,
    );

    entity.removeComponent(COMPONENT_NAMES.CompC);

    assert.strictEqual(
      world.getEntities([
        COMPONENT_NAMES.CompA,
        COMPONENT_NAMES.CompB,
        COMPONENT_NAMES.CompC,
      ]).length,
      99,
    );

    assert.strictEqual(
      world.getEntities([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).length,
      100,
    );
  });

  it('should emit signal when entity with one component is added', () => {
    const world = new World();

    let aListener = false;
    let bListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA]).subscribe(() => {
      aListener = true;
    });

    world.entityAdded$([COMPONENT_NAMES.CompB]).subscribe(() => {
      bListener = true;
    });

    const entity = new Entity();
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompA));

    world.addEntity(entity);

    assert.strictEqual(aListener, true);
    assert.strictEqual(bListener, false);
  });

  it('should emit signal when entity with two components is added', () => {
    const world = new World();

    let aListener = false;
    let abListener = false;
    let cListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA]).subscribe(() => {
      aListener = true;
    });

    world.entityAdded$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).subscribe(
      () => {
        abListener = true;
      },
    );

    world.entityAdded$([COMPONENT_NAMES.CompC]).subscribe(() => {
      cListener = true;
    });

    const entity = new Entity();
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompA));
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompB));

    world.addEntity(entity);

    assert.strictEqual(aListener, true);
    assert.strictEqual(abListener, true);
    assert.strictEqual(cListener, false);
  });

  it('should emit signal when entity is removed', () => {
    const world = new World();

    let aListener = false;
    let bListener = false;

    world.entityRemoved$([COMPONENT_NAMES.CompA]).subscribe(() => {
      aListener = true;
    });

    world.entityRemoved$([COMPONENT_NAMES.CompB]).subscribe(() => {
      bListener = true;
    });

    const entity = new Entity();
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompA));
    world.addEntity(entity);

    assert.strictEqual(aListener, false);
    assert.strictEqual(bListener, false);

    world.removeEntity(entity);

    assert.strictEqual(aListener, true);
    assert.strictEqual(bListener, false);
  });

  it('should emit signal when entity has component added', () => {
    const world = new World();

    let abListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB]).subscribe(
      () => {
        abListener = true;
      },
    );

    const entity = new Entity();
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompA));
    world.addEntity(entity);

    assert.strictEqual(abListener, false);

    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompB));

    assert.strictEqual(abListener, true);
  });

  it('should emit signal when entity has component removed', () => {
    const world = new World();

    let abListener = false;

    world
      .entityRemoved$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB])
      .subscribe(() => {
        abListener = true;
      });

    const entity = new Entity();
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompA));
    entity.addComponent(new DummyComponent(COMPONENT_NAMES.CompB));
    world.addEntity(entity);

    assert.strictEqual(abListener, false);

    entity.removeComponent(COMPONENT_NAMES.CompB);

    assert.strictEqual(abListener, true);
  });
});
