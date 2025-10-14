import { Observable, Subject } from 'rxjs';

import type { Component } from './component.js';

let entityId = 0;

/**
 * The entity is the container of components.
 */
export class Entity {
	/**
	 * unique id of entity
	 */
	public readonly id: number;

	private readonly _componentAddedSubject$ = new Subject<Component>();
	private readonly _componentRemovedSubject$ = new Subject<Component>();

	private readonly _componentMap = new Map<symbol, Component>();

	constructor() {
		this.id = entityId++;
	}

	/**
	 * Check if this entity has a component by name.
	 * @param componentName
	 */
	hasComponent(componentName: symbol): boolean {
		return this._componentMap.has(componentName);
	}

	/**
	 * Get a component of this entity by name.
	 * @param componentName
	 */
	getComponent<T extends Component>(componentName: symbol): T | undefined {
		const component = this._componentMap.get(componentName);
		if (typeof component !== 'undefined') {
			return component as T;
		}
		return undefined;
	}

	/**
	 * Add a component to this entity.
	 * @param component
	 */
	addComponent(component: Component): Entity {
		this._componentMap.set(component.name, component);
		this._componentAddedSubject$.next(component);
		return this;
	}

	/**
	 * Remove a component from this entity by name.
	 * @param componentName
	 */
	removeComponent(componentName: symbol): Entity {
		const component = this._componentMap.get(componentName);
		if (typeof component !== 'undefined') {
			this._componentMap.delete(componentName);
			this._componentRemovedSubject$.next(component);
		}
		return this;
	}

	/**
	 * Stream triggered when a component is added
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 */
	get componentAdded$(): Observable<Component> {
		return this._componentAddedSubject$.asObservable();
	}

	/**
	 * Stream triggered when a component is removed
	 * Note: make sure to unsubscribe. If needed, use `DisposeBag` util
	 */
	get componentRemoved$(): Observable<Component> {
		return this._componentRemovedSubject$.asObservable();
	}
}
