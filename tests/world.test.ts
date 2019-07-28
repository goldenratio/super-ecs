import { Component, Entity, World } from '../src';

const COMPONENT_NAMES = {
  CompA: Symbol('CompA'),
  CompB: Symbol('CompB'),
  CompC: Symbol('CompC'),
  CompD: Symbol('CompD'),
};

function createEntityA() {
  const compA = new Component(COMPONENT_NAMES.CompA);
  const compB = new Component(COMPONENT_NAMES.CompB);
  const compC = new Component(COMPONENT_NAMES.CompC);

  const entity = new Entity();
  entity
    .addComponent(compA)
    .addComponent(compB)
    .addComponent(compC);
  return entity;
}

function createEntityB() {
  const compA = new Component(COMPONENT_NAMES.CompA);
  const compB = new Component(COMPONENT_NAMES.CompB);

  const entity = new Entity();
  entity
    .addComponent(compA)
    .addComponent(compB);
  return entity;
}

function createEntityC() {
  const compA = new Component(COMPONENT_NAMES.CompA);
  const compC = new Component(COMPONENT_NAMES.CompC);

  const entity = new Entity();
  entity
    .addComponent(compA)
    .addComponent(compC);
  return entity;
}

describe('World', () => {
  it('should get correct entities for each family', function () {

    const world = new World();

    Array.from({ length: 100 })
      .forEach(() => {
        const entity = createEntityA();
        world.addEntity(entity);
      });

    Array.from({ length: 100 })
      .forEach(() => {
        const entity = createEntityB();
        world.addEntity(entity);
      });

    Array.from({ length: 100 })
      .forEach(() => {
        const entity = createEntityC();
        world.addEntity(entity);
      });


    expect(world.getEntities([COMPONENT_NAMES.CompA]).length).toBe(300);
    expect(world.getEntities([COMPONENT_NAMES.CompB]).length).toBe(200);
    expect(world.getEntities([COMPONENT_NAMES.CompC]).length).toBe(200);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC
    ]).length).toBe(100);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB
    ]).length).toBe(200);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompC
    ]).length).toBe(200);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC,
      COMPONENT_NAMES.CompD
    ]).length).toBe(0);

  });

  it('should update entity-family relationship when adding components', function () {

    const world = new World();
    let entity: Entity = new Entity();

    Array.from({ length: 100 })
      .forEach(() => {
        entity = createEntityB();
        world.addEntity(entity);
      });

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB
    ]).length).toBe(100);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC,
    ]).length).toBe(0);

    const compC = new Component(COMPONENT_NAMES.CompC);
    entity.addComponent(compC);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC,
    ]).length).toBe(1);

  });

  it('should update entity-family relationship when removing components', function () {

    const world = new World();
    let entity: Entity = new Entity();

    Array.from({ length: 100 })
      .forEach(() => {
        entity = createEntityA();
        world.addEntity(entity);
      });

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC,
    ]).length).toBe(100);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB
    ]).length).toBe(100);

    entity.removeComponent(COMPONENT_NAMES.CompC);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB,
      COMPONENT_NAMES.CompC,
    ]).length).toBe(99);

    expect(world.getEntities([
      COMPONENT_NAMES.CompA,
      COMPONENT_NAMES.CompB
    ]).length).toBe(100);

  });

  it('should emit signal when entity with one component is added', function () {

    const world = new World();

    let aListener = false;
    let bListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA])
      .subscribe(() => {
        aListener = true;
      });

    world.entityAdded$([COMPONENT_NAMES.CompB])
      .subscribe(() => {
        bListener = true
      });

    const entity = new Entity();
    entity.addComponent(new Component(COMPONENT_NAMES.CompA));

    world.addEntity(entity);

    expect(aListener).toBe(true);
    expect(bListener).toBe(false);

  });

  it('should emit signal when entity with two components is added', function () {

    const world = new World();

    let aListener = false;
    let abListener = false;
    let cListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA])
      .subscribe(() => {
        aListener = true;
      });

    world.entityAdded$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB])
      .subscribe(() => {
        abListener = true;
      });

    world.entityAdded$([COMPONENT_NAMES.CompC])
      .subscribe(() => {
        cListener = true;
      });

    const entity = new Entity();
    entity.addComponent(new Component(COMPONENT_NAMES.CompA));
    entity.addComponent(new Component(COMPONENT_NAMES.CompB));

    world.addEntity(entity);

    expect(aListener).toBe(true);
    expect(abListener).toBe(true);
    expect(cListener).toBe(false);

  });

  it('should emit signal when entity is removed', function () {

    const world = new World();

    let aListener = false;
    let bListener = false;

    world.entityRemoved$([COMPONENT_NAMES.CompA])
      .subscribe(() => {
        aListener = true;
      });

    world.entityRemoved$([COMPONENT_NAMES.CompB])
      .subscribe(() => {
        bListener = true;
      });

    const entity = new Entity();
    entity.addComponent(new Component(COMPONENT_NAMES.CompA));
    world.addEntity(entity);

    expect(aListener).toBe(false);
    expect(bListener).toBe(false);

    world.removeEntity(entity);

    expect(aListener).toBe(true);
    expect(bListener).toBe(false);

  });

  it('should emit signal when entity has component added', function () {

    const world = new World();

    let abListener = false;

    world.entityAdded$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB])
      .subscribe(() => {
        abListener = true;
      });

    const entity = new Entity();
    entity.addComponent(new Component(COMPONENT_NAMES.CompA));
    world.addEntity(entity);

    expect(abListener).toBe(false);

    entity.addComponent(new Component(COMPONENT_NAMES.CompB));

    expect(abListener).toBe(true);
  });

  it('should emit signal when entity has component removed', function () {

    const world = new World();

    let abListener = false;

    world.entityRemoved$([COMPONENT_NAMES.CompA, COMPONENT_NAMES.CompB])
      .subscribe(() => {
        abListener = true;
      });

    const entity = new Entity();
    entity.addComponent(new Component(COMPONENT_NAMES.CompA));
    entity.addComponent(new Component(COMPONENT_NAMES.CompB));
    world.addEntity(entity);

    expect(abListener).toBe(false);

    entity.removeComponent(COMPONENT_NAMES.CompB);

    expect(abListener).toBe(true);

  });
});
