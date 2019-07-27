/**
 * The components is the container of some properties that
 * the entity possesses. It may also contain some methods.
 */
export class Component {

  /**
   * Component name. It should be unique
   */
  readonly name: string;

  constructor(name: string) {
    if (name.trim() === '') {
      throw Error('invalid component name');
    }
    this.name = name;
  }
}
