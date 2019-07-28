/**
 * The components is the container of some properties that
 * the entity possesses. It may also contain some methods.
 */
export declare class Component {
    /**
     * Component name. It should be unique
     */
    readonly name: symbol;
    constructor(name: symbol);
}
