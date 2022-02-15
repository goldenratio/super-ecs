import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { System } from '../system';
import { Entity } from '../entity';
import { Component } from '../component';

import { EntityList } from './entity-list';
import { Family } from './family';
import { TickerDataLike } from '../types';

export class World {
	private readonly _systems: Array<System> = [];
	private readonly _entities = new EntityList();
	private readonly _families = new Map<string, Family>();

	private readonly _disposeEntityMap = new Map<Entity, Subject<void>>();

	constructor() {
		// empty
	}

	/**
	 * Add a system to this world.
	 * @param system
	 */
	addSystem(system: System): World {
		this._systems.push(system);
		system.addedToWorld(this);
		return this;
	}

	/**
	 * Remove a system from this world.
	 * @param system
	 */
	removeSystem(system: System): World {
		const systems = this._systems;
		const len = systems.length;
		for (let i = 0; i < len; ++i) {
			if (systems[i] === system) {
				systems.splice(i, 1);
				system.removedFromWorld(this);
			}
		}

		return this;
	}

	/**
	 * Remove all systems from this world
	 */
	removeAllSystems(): World {
		this._systems.forEach(system => system.removedFromWorld(this));
		this._systems.length = 0;
		return this;
	}

	/**
	 * Add an entity to this world.
	 * @param entity
	 */
	addEntity(entity: Entity): World {
		// try to add the entity into each family
		this._families.forEach(family => family.addEntityIfMatch(entity));

		const dispose$ = new Subject<void>();
		this._disposeEntityMap.set(entity, dispose$);

		// update the entity-family relationship whenever components are
		// added to or removed from the entities
		const { componentAdded$, componentRemoved$ } = entity;
		componentAdded$.pipe(takeUntil(dispose$)).subscribe(component => this.onComponentAdded(entity, component));

		componentRemoved$.pipe(takeUntil(dispose$)).subscribe(component => this.onComponentRemoved(entity, component));

		this._entities.add(entity);
		return this;
	}

	/**
	 * Remove and entity from this world.
	 * @param entity
	 */
	removeEntity(entity: Entity): World {
		this._families.forEach(family => family.removeEntity(entity));
		this._entities.remove(entity);

		const dispose$ = this._disposeEntityMap.get(entity);
		if (typeof dispose$ !== 'undefined') {
			dispose$.next();
			this._disposeEntityMap.delete(entity);
		}
		return this;
	}

	/**
	 * Removes all entities
	 */
	removeAllEntities(): World {
		this._entities.toArray().forEach(entity => this.removeEntity(entity));
		return this;
	}

	/**
	 * Get the entities having all the specified components.
	 * @param componentNames
	 */
	getEntities(componentNames: ReadonlyArray<symbol>): ReadonlyArray<Entity> {
		const familyId = this.generateFamilyId(componentNames);
		this.ensureFamilyExists(componentNames, familyId);

		const family = this._families.get(familyId);
		if (typeof family !== 'undefined') {
			return family.getEntities();
		}

		throw Error(`unable to getEntities, ${componentNames}`);
	}

	/**
	 * For each system in the world, call its `update` method.
	 * @param tickerData
	 */
	update(tickerData: TickerDataLike): void {
		const systems = this._systems;
		const len = systems.length;

		for (let i = 0; i < len; ++i) {
			systems[i].update(tickerData);
		}
	}

	/**
	 * Returns the Observable for entities added with the specified components. The
	 * Observable is also emitted when a component is added to an entity causing it
	 * match the specified component names.
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 * @param componentNames
	 */
	entityAdded$(componentNames: ReadonlyArray<symbol>): Observable<Entity> {
		const familyId = this.generateFamilyId(componentNames);
		this.ensureFamilyExists(componentNames, familyId);

		const family = this._families.get(familyId);
		if (typeof family !== 'undefined') {
			return family.entityAdded$;
		}

		throw Error(`unable to perform entityAdded, ${componentNames}`);
	}

	/**
	 * Returns the Observable for entities removed with the specified components.
	 * The Observable is also emitted when a component is removed from an entity
	 * causing it to no longer match the specified component names.
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 * @param componentNames
	 */
	entityRemoved$(componentNames: ReadonlyArray<symbol>): Observable<Entity> {
		const familyId = this.generateFamilyId(componentNames);
		this.ensureFamilyExists(componentNames, familyId);

		const family = this._families.get(familyId);
		if (typeof family !== 'undefined') {
			return family.entityRemoved$;
		}

		throw Error(`unable to perform entityRemoved, ${componentNames}`);
	}

	private generateFamilyId(componentNames: ReadonlyArray<symbol>): string {
		const keys = componentNames.map(data => data.toString());
		return `$-${keys.join(',')}`;
	}

	private ensureFamilyExists(componentNames: ReadonlyArray<symbol>, familyId: string): void {
		const families = this._families;
		if (families.has(familyId)) {
			return;
		}

		const family = new Family([...componentNames]);
		families.set(familyId, family);

		for (let node = this._entities.head; node; node = node.next) {
			const family = families.get(familyId);
			if (typeof family !== 'undefined') {
				family.addEntityIfMatch(node.entity);
			}
		}
	}

	private onComponentAdded(entity: Entity, component: Component): void {
		this._families.forEach(family => family.onComponentAdded(entity, component));
	}

	private onComponentRemoved(entity: Entity, component: Component): void {
		this._families.forEach(family => family.onComponentRemoved(entity, component));
	}
}
