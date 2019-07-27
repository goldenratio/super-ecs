import { Observable, Subject } from 'rxjs';
import { Component } from './component';

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
  private readonly _removedSubject$ = new Subject<void>();

  private readonly _componentMap = new Map<string, Component>();

  constructor() {
    this.id = entityId++;
  }

  /**
   * Check if this entity has a component by name.
   * @param componentName
   */
  hasComponent(componentName: string): boolean {
    return this._componentMap.has(componentName);
  }

  /**
   * Get a component of this entity by name.
   * @param componentName
   */
  getComponent<T extends Component>(componentName: string): T | undefined {
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
  addComponent(component: Component): void {
    this._componentMap.set(component.name, component);
    this._componentAddedSubject$.next(component);
  }

  /**
   * Remove a component from this entity by name.
   * @param componentName
   */
  removeComponent(componentName: string): void {
    const component = this._componentMap.get(componentName);
    if (typeof component !== 'undefined') {
      this._componentMap.delete(componentName);
      this._componentRemovedSubject$.next(component);
    }
  }

  /**
   * Called this entity is removed from world
   */
  removedFromWorld(): void {
    this._removedSubject$.next();
  }

  /**
   * Stream triggered when a component is added
   */
  get componentAdded$(): Observable<Component> {
    return this._componentAddedSubject$;
  }

  /**
   * Stream triggered when a component is removed
   */
  get componentRemoved$(): Observable<Component> {
    return this._componentRemovedSubject$;
  }

  /**
   * Stream triggered when this entity is removed
   */
  get removed$(): Observable<void> {
    return this._removedSubject$;
  }
}
