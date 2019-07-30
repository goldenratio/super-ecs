import { System, World } from '../../src';
import { SpriteComponent } from '../components/sprite-component';
import { COMPONENT_NAMES } from '../components/types';

export class SceneSystem extends System {

  private readonly _container: PIXI.Container;

  constructor(container: PIXI.Container) {
    super();
    this._container = container;
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    world.entityAdded$([COMPONENT_NAMES.SpriteComponent])
      .subscribe(entity => {
        const spriteComponent = entity.getComponent<SpriteComponent>(COMPONENT_NAMES.SpriteComponent);
        if (!spriteComponent) {
          return;
        }

        const { sprite } = spriteComponent;
        if (sprite) {
          this._container.addChild(sprite);
        }
      });

    world.entityRemoved$([COMPONENT_NAMES.SpriteComponent])
      .subscribe(entity => {
        const spriteComponent = entity.getComponent<SpriteComponent>(COMPONENT_NAMES.SpriteComponent);
        if (!spriteComponent) {
          return;
        }

        const { sprite } = spriteComponent;
        if (sprite) {
          this._container.removeChild(sprite);
        }
      });
  }
}
