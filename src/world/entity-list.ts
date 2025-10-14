import { Entity } from '../entity.js';
import { EntityNode } from './entity-node.js';

/**
 * The entity list is a doubly-linked-list which allows the
 * entities to be added and removed efficiently.
 */
export class EntityList {
	public length: number = 0;
	public head: EntityNode | null = null;
	public tail: EntityNode | null = null;

	private readonly _entityMap = new Map<number, EntityNode>();

	constructor() {
		//
	}

	/**
	 * Add an entity into this list.
	 * @param entity
	 */
	add(entity: Entity): void {
		const node = new EntityNode(entity);

		if (this.head === null) {
			this.head = this.tail = node;
		} else {
			node.prev = this.tail;
			if (this.tail) {
				this.tail.next = node;
			}
			this.tail = node;
		}

		this.length += 1;
		this._entityMap.set(entity.id, node);
	}

	/**
	 * Remove an entity from this list.
	 * @param entity
	 */
	remove(entity: Entity): void {
		const entityId = entity.id;
		const node = this._entityMap.get(entityId);

		if (typeof node === 'undefined') {
			return;
		}

		if (node.prev === null) {
			this.head = node.next;
		} else {
			node.prev.next = node.next;
		}

		if (node.next === null) {
			this.tail = node.prev;
		} else {
			node.next.prev = node.prev;
		}

		this.length -= 1;
		this._entityMap.delete(entityId);
	}

	/**
	 * Check if this list has the entity
	 * @param entity
	 */
	has(entity: Entity): boolean {
		return this._entityMap.has(entity.id);
	}

	/**
	 * Remove all the entities from this list.
	 */
	clear(): void {
		this.head = this.tail = null;
		this.length = 0;
		this._entityMap.clear();
	}

	/**
	 * Return an array holding all the entities in this list.
	 */
	toArray(): ReadonlyArray<Entity> {
		let array = [],
			node;

		for (node = this.head; node; node = node.next) {
			array.push(node.entity);
		}

		return array;
	}
}
