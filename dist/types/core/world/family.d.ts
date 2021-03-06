import { Observable } from 'rxjs';
import { Entity } from '../entity';
import { Component } from '../component';
export declare class Family {
    private readonly _componentNames;
    private readonly _entityAddedSubject$;
    private readonly _entityRemovedSubject$;
    private readonly _entities;
    constructor(componentNames: ReadonlyArray<symbol>);
    /**
     * Get the entities of this family.
     */
    getEntities(): ReadonlyArray<Entity>;
    /**
     * Add the entity into the family if match.
     * @param entity
     */
    addEntityIfMatch(entity: Entity): void;
    /**
     * Remove the entity into the family if match.
     * @param entity
     */
    removeEntity(entity: Entity): void;
    onComponentAdded(entity: Entity, component: Component): void;
    onComponentRemoved(entity: Entity, component: Component): void;
    /**
     * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
     */
    get entityAdded$(): Observable<Entity>;
    /**
     * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
     */
    get entityRemoved$(): Observable<Entity>;
    private matchEntity;
}
