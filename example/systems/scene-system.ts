import { System, World } from '../../src';
import { SpriteComponent } from '../components/sprite-component';

export class SceneSystem extends System {

  private readonly _container: PIXI.Container;

  constructor(container: PIXI.Container) {
    super();
    this._container = container;
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    world.entityAdded$([SpriteComponent.CNAME])
      .subscribe(entity => {
        const spriteComponent = entity.getComponent<SpriteComponent>(SpriteComponent.CNAME);
        if (!spriteComponent) {
          return;
        }

        const { sprite } = spriteComponent;
        if (sprite) {
          this._container.addChild(sprite);
        }
      });
  }
}
