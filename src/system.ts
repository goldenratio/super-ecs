import { World } from './world';
import type { TickerDataLike } from './types';

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
	 * @param tickerData
	 */
	update(tickerData: TickerDataLike): void {
		// empty
	}

	/**
	 * Reference to the world
	 */
	get world(): World {
		if (!this._world) {
			throw Error('wait till the system is added to the world');
		}
		return this._world;
	}
}
