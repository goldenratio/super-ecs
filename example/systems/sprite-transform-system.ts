import { System } from '../../src';
import { SpriteComponent } from '../components/sprite-component';
import { TransformComponent } from '../components/transform-component';

export class SpriteTransformSystem extends System {

  update(delta: number): void {
    const entities = this.world.getEntities([TransformComponent.CNAME, SpriteComponent.CNAME]);
    if (entities.length === 0) {
      return;
    }

    entities.forEach(entity => {
      const transformComponent = entity.getComponent<TransformComponent>(TransformComponent.CNAME);
      const spriteComponent = entity.getComponent<SpriteComponent>(SpriteComponent.CNAME);

      if (transformComponent && spriteComponent) {
        const { sprite } = spriteComponent;
        if (sprite) {
          sprite.position.set(transformComponent.x, transformComponent.y);
        }
      }
    });
  }
}
