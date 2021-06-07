import { Observable, Subject } from 'rxjs';

import { Entity } from '../entity';
import { Component } from '../component';

import { EntityList } from './entity-list';

export class Family {
	private readonly _componentNames: ReadonlyArray<symbol>;

	private readonly _entityAddedSubject$ = new Subject<Entity>();
	private readonly _entityRemovedSubject$ = new Subject<Entity>();
	private readonly _entities = new EntityList();

	constructor(componentNames: ReadonlyArray<symbol>) {
		this._componentNames = componentNames;
	}

	/**
	 * Get the entities of this family.
	 */
	getEntities(): ReadonlyArray<Entity> {
		return this._entities.toArray();
	}

	/**
	 * Add the entity into the family if match.
	 * @param entity
	 */
	addEntityIfMatch(entity: Entity): void {
		if (!this._entities.has(entity) && this.matchEntity(entity)) {
			this._entities.add(entity);
			this._entityAddedSubject$.next(entity);
		}
	}

	/**
	 * Remove the entity into the family if match.
	 * @param entity
	 */
	removeEntity(entity: Entity): void {
		if (this._entities.has(entity)) {
			this._entities.remove(entity);
			this._entityRemovedSubject$.next(entity);
		}
	}

	onComponentAdded(entity: Entity, component: Component): void {
		this.addEntityIfMatch(entity);
	}

	onComponentRemoved(entity: Entity, component: Component): void {
		// return if the entity is not in this family
		if (!this._entities.has(entity)) {
			return;
		}

		// remove the node if the removed component is required by this family
		const names = this._componentNames;
		const len = names.length;
		for (let i = 0; i < len; ++i) {
			if (names[i] === component.name) {
				this._entities.remove(entity);
				this._entityRemovedSubject$.next(entity);
			}
		}
	}

	/**
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 */
	get entityAdded$(): Observable<Entity> {
		return this._entityAddedSubject$.asObservable();
	}

	/**
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 */
	get entityRemoved$(): Observable<Entity> {
		return this._entityRemovedSubject$.asObservable();
	}

	private matchEntity(entity: Entity): boolean {
		const componentNames = this._componentNames;
		const len = componentNames.length;

		for (let i = 0; i < len; ++i) {
			if (!entity.hasComponent(componentNames[i])) {
				return false;
			}
		}

		return true;
	}
}
