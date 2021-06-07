import { Observable } from 'rxjs';
import { System } from '../system';
import { Entity } from '../entity';
export declare class World {
    private readonly _systems;
    private readonly _entities;
    private readonly _families;
    private readonly _disposeEntityMap;
    constructor();
    /**
     * Add a system to this world.
     * @param system
     */
    addSystem(system: System): World;
    /**
     * Remove a system from this world.
     * @param system
     */
    removeSystem(system: System): World;
    /**
     * Remove all systems from this world
     */
    removeAllSystems(): World;
    /**
     * Add an entity to this world.
     * @param entity
     */
    addEntity(entity: Entity): World;
    /**
     * Remove and entity from this world.
     * @param entity
     */
    removeEntity(entity: Entity): World;
    /**
     * Removes all entities
     */
    removeAllEntities(): World;
    /**
     * Get the entities having all the specified components.
     * @param componentNames
     */
    getEntities(componentNames: ReadonlyArray<symbol>): ReadonlyArray<Entity>;
    /**
     * For each system in the world, call its `update` method.
     * @param delta
     */
    update(delta: number): void;
    /**
     * Returns the Observable for entities added with the specified components. The
     * Observable is also emitted when a component is added to an entity causing it
     * match the specified component names.
     * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
     * @param componentNames
     */
    entityAdded$(componentNames: ReadonlyArray<symbol>): Observable<Entity>;
    /**
     * Returns the Observable for entities removed with the specified components.
     * The Observable is also emitted when a component is removed from an entity
     * causing it to no longer match the specified component names.
     * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
     * @param componentNames
     */
    entityRemoved$(componentNames: ReadonlyArray<symbol>): Observable<Entity>;
    private generateFamilyId;
    private ensureFamilyExists;
    private onComponentAdded;
    private onComponentRemoved;
}
