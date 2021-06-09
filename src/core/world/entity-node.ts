import { Entity } from '../entity';

export class EntityNode {
	public readonly entity: Entity;

	public prev: EntityNode | null = null;
	public next: EntityNode | null = null;

	constructor(entity: Entity) {
		this.entity = entity;
	}
}
