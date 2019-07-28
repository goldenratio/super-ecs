import { System, World } from '../src';

describe('System', () => {

  it('should call addedToWorld when system is added to world', function () {

    const addedToWorld = System.prototype.addedToWorld = jest.fn();

    const world = new World();
    const system = new System();
    world.addSystem(system);

    expect(addedToWorld).toHaveBeenCalled();
  });

  it('should call removedFromWorld when system is removed from world', function () {

    const removedFromWorld = System.prototype.removedFromWorld = jest.fn();

    const world = new World();
    const system = new System();
    world.addSystem(system);

    world.removeSystem(system);
    expect(removedFromWorld).toHaveBeenCalled();
  });
});
