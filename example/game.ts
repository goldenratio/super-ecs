import 'pixi.js';
import { Entity, World } from '../src';
import { SpriteTransformSystem } from './systems/sprite-transform-system';
import { TransformComponent } from './components/transform-component';
import { SpriteComponent } from './components/sprite-component';
import { SceneSystem } from './systems/scene-system';
import { RandomMovementSystem } from './systems/random-movement-system';

const app = new PIXI.Application({
  width: 600,
  height: 400,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
  sharedTicker: true
});

document.body.appendChild(app.view);
const container = new PIXI.Container();
app.stage.addChild(container);

PIXI.loader
  .add('p1', './assets/p1_front.png')
  .add('p2', './assets/p2_front.png')
  .load(() => init());

function init(): void {

  const world = new World();

  // systems
  world
    .addSystem(new SceneSystem(container))
    .addSystem(new SpriteTransformSystem())
    .addSystem(new RandomMovementSystem());

  // entities
  Array.from({ length: 50 })
    .forEach(() => {
      const entity = createHeroEntity();
      world.addEntity(entity);
    });

  // game loop
  app.ticker.add(deltaTime => world.update(deltaTime));
}

function createHeroEntity(): Entity {

  const direction = Math.floor(Math.random() * 10) > 5 ? -1 : 1;
  const x = Math.floor(Math.random() * 600);
  const y = Math.floor(Math.random() * 400);
  const texture = Math.floor(Math.random() * 10) > 5 ? 'p1' : 'p2';

  const hero = new Entity();
  hero
    .addComponent(new TransformComponent({ x, y, direction }))
    .addComponent(new SpriteComponent(texture));

  return hero;
}
