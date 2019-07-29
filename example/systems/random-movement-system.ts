import { System } from '../../src';
import { TransformComponent } from '../components/transform-component';

export class RandomMovementSystem extends System {

  private readonly _stageWidth: number;
  private readonly _stageHeight: number;

  constructor(props = { width: 600, height: 400 }) {
    super();
    this._stageWidth = props.width;
    this._stageHeight = props.height;
  }

  update(delta: number): void {
    const entities = this.world.getEntities([TransformComponent.CNAME]);
    if (entities.length === 0) {
      return;
    }

    entities.forEach(entity => {
      const transformComponent = entity.getComponent<TransformComponent>(TransformComponent.CNAME);
      if (transformComponent) {
        const { speed, direction } = transformComponent;
        transformComponent.x += speed * direction;
        transformComponent.y += speed * direction;

        const stageWidth = this._stageWidth;
        const stageHeight = this._stageHeight;

        const offset = 92;

        if(transformComponent.x < -offset)
          transformComponent.x = stageWidth + offset;

        if(transformComponent.y < -offset)
          transformComponent.y = stageHeight + offset;

        if(transformComponent.x > stageWidth + offset)
          transformComponent.x = -offset;

        if(transformComponent.y > stageHeight + offset)
          transformComponent.y = -offset;
      }
    });
  }
}
