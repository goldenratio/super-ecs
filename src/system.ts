import { World } from './world';

/**
 * The system is responsible for updating the entities.
 */
export class System {

  private _world: World | undefined;

  /**
   * Called when system is added to the world
   * @param world
   */
  addedToWorld(world: World): void {
    this._world = world;
  }

  /**
   * Called when system is removed from the world
   * @param world
   */
  removedFromWorld(world: World): void {
    this._world = undefined;
  }

  /**
   * Update loop
   * @param delta
   */
  update(delta: number): void {
    //
  }

  /**
   * Reference to the world
   */
  get world(): World {
    if (!this._world) {
      throw Error('wait till the world is added to the system');
    }
    return this._world;
  }
}
