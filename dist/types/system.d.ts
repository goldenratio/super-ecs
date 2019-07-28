import { World } from './world';
/**
 * The system is responsible for updating the entities.
 */
export declare class System {
    private _world;
    /**
     * Called when system is added to the world
     * @param world
     */
    addedToWorld(world: World): void;
    /**
     * Called when system is removed from the world
     * @param world
     */
    removedFromWorld(world: World): void;
    /**
     * Update loop
     * @param delta
     */
    update(delta: number): void;
    /**
     * Reference to the world
     */
    readonly world: World;
}
