import { Entity } from '../entity';
export declare class EntityNode {
    readonly entity: Entity;
    prev: EntityNode | null;
    next: EntityNode | null;
    constructor(entity: Entity);
}
