import { System, World } from '../src/core';

describe('System', () => {

  it('should call addedToWorld when system is added to world', function () {

    const system = new System();
    const addedToWorld = system.addedToWorld = jest.fn();

    const world = new World();
    world.addSystem(system);

    expect(addedToWorld).toHaveBeenCalled();
  });

  it('should call removedFromWorld when system is removed from world', function () {

    const system = new System();
    const removedFromWorld = system.removedFromWorld = jest.fn();

    const world = new World();
    world.addSystem(system);

    world.removeSystem(system);

    expect(removedFromWorld).toHaveBeenCalled();
  });

  it('should have correct reference to world', function () {

    const system = new System();

    const world = new World();
    expect(() => system.world).toThrow();

    world.addSystem(system);

    expect(system.world).toBeDefined();
    expect(system.world).toBe(world);

    world.removeSystem(system);

    expect(() => system.world).toThrow();
  });
});
