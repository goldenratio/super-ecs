import { describe, it } from 'node:test';
import assert from 'node:assert';

import { System, World } from '../src';

describe('System', () => {

  it('should call addedToWorld when system is added to world', () => {
    let addedToWorld = false;
    const system = new System();
    system.addedToWorld = () => { addedToWorld = true; };

    const world = new World();
    world.addSystem(system);

    assert.ok(addedToWorld, 'expected addedToWorld to be called');
  });

  it('should call removedFromWorld when system is removed from world', () => {
    let removedFromWorld = false;
    const system = new System();
    system.removedFromWorld = () => { removedFromWorld = true; };

    const world = new World();
    world.addSystem(system);

    world.removeSystem(system);

    assert.ok(removedFromWorld, 'expected removedFromWorld to be called');
  });

  it('should have correct reference to world', () => {
    const system = new System();

    const world = new World();
    assert.throws(() => system.world);

    world.addSystem(system);

    assert.ok(system.world);
    assert.strictEqual(system.world, world);

    world.removeSystem(system);

    assert.throws(() => system.world);
  });
});
