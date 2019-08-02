/**
 * The components is the container of some properties that
 * the entity possesses. It may also contain some methods.
 */
export interface Component {

  /**
   * Component name. It should be unique
   */
  readonly name: symbol;
}

export type ComponentProps<T> = Partial<Omit<T, 'name'>>;
