import { Observable } from 'rxjs';

import { System } from '../system'
import { Entity } from '../entity';

import { EntityList } from './entity-list';
import { Family } from './family';
import { Component } from '../component';

export class World {

  private readonly _systems: Array<System> = [];
  private readonly _entities = new EntityList();
  private readonly _families = new Map<string, Family>();

  constructor() {
    //
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
   * Add an entity to this world.
   * @param entity
   */
  addEntity(entity: Entity): World {

    // try to add the entity into each family
    this._families.forEach(family => family.addEntity(entity));

    // update the entity-family relationship whenever components are
    // added to or removed from the entities
    const { componentAdded$, componentRemoved$ } = entity;
    componentAdded$
      .subscribe(component => this.onComponentAdded(entity, component));

    componentRemoved$
      .subscribe(component => this.onComponentRemoved(entity, component));

    this._entities.add(entity);

    return this;
  }

  /**
   * Remove and entity from this world.
   * @param entity
   */
  removeEntity(entity: Entity): void {
    this._families.forEach(family => family.removeEntity(entity));
    this._entities.remove(entity);
  }

  /**
   * Get the entities having all the specified components.
   * @param componentNames
   */
  getEntities(componentNames: ReadonlyArray<string>): ReadonlyArray<Entity> {

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
   * @param delta
   */
  update(delta: number): void {
    const systems = this._systems;
    const len = systems.length;

    for (let i = 0; i < len; ++i) {
      systems[i].update(delta);
    }
  }

  /**
   * Returns the signal for entities added with the specified components. The
   * signal is also emitted when a component is added to an entity causing it
   * match the specified component names.
   * @param componentNames
   */
  entityAdded$(componentNames: ReadonlyArray<string>): Observable<Entity> {

    const familyId = this.generateFamilyId(componentNames);
    this.ensureFamilyExists(componentNames, familyId);

    const family = this._families.get(familyId);
    if (typeof family !== 'undefined') {
      return family.entityAdded$;
    }

    throw Error(`unable to perform entityAdded, ${componentNames}`);
  }

  /**
   * Returns the signal for entities removed with the specified components.
   * The signal is also emitted when a component is removed from an entity
   * causing it to no longer match the specified component names.
   * @param componentNames
   */
  entityRemoved$(componentNames: ReadonlyArray<string>): Observable<Entity> {

    const familyId = this.generateFamilyId(componentNames);
    this.ensureFamilyExists(componentNames, familyId);

    const family = this._families.get(familyId);
    if (typeof family !== 'undefined') {
      return family.entityRemoved$;
    }

    throw Error(`unable to perform entityRemoved, ${componentNames}`);
  }

  private generateFamilyId(componentNames: ReadonlyArray<string>): string {
    return `$${componentNames.join(',')}`;
  }

  private ensureFamilyExists(componentNames: ReadonlyArray<string>, familyId: string): void {
    const families = this._families;
    // const familyId = this.generateFamilyId(componentNames);

    if (!families.has(familyId)) {
      // todo: remove .call
      const family = new Family(Array.prototype.slice.call(componentNames));
      families.set(familyId, family);

      for (let node = this._entities.head; node; node = node.next) {
        const family = families.get(familyId);
        if (typeof family !== 'undefined') {
          family.addEntity(node.entity);
        }
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
