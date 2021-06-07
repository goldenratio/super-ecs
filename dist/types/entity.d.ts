import { Observable } from 'rxjs';
import { Component } from './component';
/**
 * The entity is the container of components.
 */
export declare class Entity {
    /**
     * unique id of entity
     */
    readonly id: number;
    private readonly _componentAddedSubject$;
    private readonly _componentRemovedSubject$;
    private readonly _componentMap;
    constructor();
    /**
     * Check if this entity has a component by name.
     * @param componentName
     */
    hasComponent(componentName: symbol): boolean;
    /**
     * Get a component of this entity by name.
     * @param componentName
     */
    getComponent<T extends Component>(componentName: symbol): T | undefined;
    /**
     * Add a component to this entity.
     * @param component
     */
    addComponent(component: Component): Entity;
    /**
     * Remove a component from this entity by name.
     * @param componentName
     */
    removeComponent(componentName: symbol): Entity;
    /**
     * Stream triggered when a component is added
     */
    get componentAdded$(): Observable<Component>;
    /**
     * Stream triggered when a component is removed
     */
    get componentRemoved$(): Observable<Component>;
}
