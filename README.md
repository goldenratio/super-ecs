# super-ecs
Entity Component System library for JavaScript/TypeScript games.


- **API Docs:** https://goldenratio.github.io/super-ecs/
- **Example Repo:** https://github.com/goldenratio/super-ecs-example
- **Example Repo (Vanilla JS):** https://github.com/goldenratio/super-ecs-vanilla-js-example
- **CDN:** https://unpkg.com/browse/super-ecs/dist/

### Status: Feature Complete

## Install

### NPM
> npm install --save super-ecs

https://www.npmjs.com/package/super-ecs

## Basic Usage
To define a new component, simply implement `Component`.
Note that each component should have a unique `name` property.

```js
const COMPONENT_NAMES = {
  Position: Symbol('Position'),
  Velocity: Symbol('Velocity'),
  Health: Symbol('Health')
};

class Position {
  name = COMPONENT_NAMES.Position;
  constructor({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
  }
}

class Velocity {
  name = COMPONENT_NAMES.Velocity;
  constructor({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
  }
}

class Health {
  name = COMPONENT_NAMES.Health;
  constructor({ maxHealth = 100 }) {
    this.health = maxHealth;
    this.maxHealth = maxHealth;
  }

  isDead() {
    return this.health <= 0;
  }

  receiveDamage(damage) {
    this.health -= damage;
  }
}
```

An entity is essentially a container of one or more components.

```js
const hero = new Entity();
hero.addComponent(new Position({ x: 0, y: 0 }));
hero.addComponent(new Velocity({ x: 0, y: 0 }));
hero.addComponent(new Health({ maxHealth: 50 }));
```

The system is responsible for updating the entities.
In a real game there may be a lot of systems, like `CollisionSystem`,
`RenderSystem`, `ControlSystem` etc.

```js
class PhysicSystem extends System {

  update(delta) {

   const entities = this.world.getEntities([COMPONENT_NAMES.Position, COMPONENT_NAMES.Velocity]);
   entities.forEach(entity => {
       const position = entity.getComponent(COMPONENT_NAMES.Position);
       const velocity = entity.getComponent(COMPONENT_NAMES.Velocity);
       if (position && velocity) {
          position.x += velocity.x * delta;
          position.y += velocity.y * delta;
       }
   });
  }
}
```

The world is the container of all the entities and systems.
Calling the `update` method will *sequentially* update all the systems,
in the order they were added.

```js
const world = new World();

world.addEntity(hero);
// ... add other entities

world.addSystem(new PhysicSystem());
// ... add other systems

requestAnimationFrame(function () {
    world.update(/* interval */);
})
```

A system is notified when it is added or removed from the world:

```js
class MySystem extends System {

  addedToWorld(world) {
    super.addedToWorld(world);
    // Code to handle being added to world. Remember to call `super`.
  }

  removedFromWorld(world) {
      super.removedFromWorld(world);
      // Code to handle being removed from world.. Remember to call `super`.
    }
}
```

The world emits Observable when entities are added or removed. You can listen for
specific entities and handle the Observable accordingly:

```js
class MySystem extends System {

  removedFromWorld(world) {
    super.removedFromWorld(world);
    if (this._disposeBag) {
      this._disposeBag.dispose();
    }
  }

  addedToWorld(world) {
    super.addedToWorld(world);
    // Code to handle being added to world. Remember to call `super`.

    this._disposeBag = new DisposeBag();

    this._disposeBag.completable$(world.entityAdded$([COMPONENT_NAMES.Position, COMPONENT_NAMES.Velocity]))
      .subscribe(entity => {
        // This function is called whenever an entity with both 'position' and
        // 'velocity' components is added to the world. It can also be called when
        // a component is added to an entity; for example, when an entity with
        // only 'position' has 'velocity' added to it.
      });

    this._disposeBag.completable$(world.entityRemoved$([COMPONENT_NAMES.Position, COMPONENT_NAMES.Velocity]))
      .subscribe(entity => {
        // This function is called whenever an entity with both 'position' and
        // 'velocity' components is removed from the world. It can also be called
        // when a component is removed from an entity; for example, when an entity
        // with both 'position' and 'velocity' has 'velocity' removed from it.
    });
  }
}
```

Port of [CES.js](https://github.com/qiao/ces.js) with some changes,
- instead of `signal`, we use `rxjs`
- component names should be of type `symbol`

## Release

### NPM
```
npm version {major | minor | patch}
npm publish
```
