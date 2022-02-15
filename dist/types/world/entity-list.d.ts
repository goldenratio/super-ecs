import { Entity } from '../entity';
import { EntityNode } from './entity-node';
/**
 * The entity list is a doubly-linked-list which allows the
 * entities to be added and removed efficiently.
 */
export declare class EntityList {
    length: number;
    head: EntityNode | null;
    tail: EntityNode | null;
    private readonly _entityMap;
    constructor();
    /**
     * Add an entity into this list.
     * @param entity
     */
    add(entity: Entity): void;
    /**
     * Remove an entity from this list.
     * @param entity
     */
    remove(entity: Entity): void;
    /**
     * Check if this list has the entity
     * @param entity
     */
    has(entity: Entity): boolean;
    /**
     * Remove all the entities from this list.
     */
    clear(): void;
    /**
     * Return an array holding all the entities in this list.
     */
    toArray(): ReadonlyArray<Entity>;
}
