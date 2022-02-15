export interface TickerDataLike {
    /**
     * milliseconds elapsed from last updated.
     * Ideally value should be 16.66 ms
     */
    readonly elapsedMS: number;
    /**
     * last updated `performance.now()`
     */
    readonly lastTime: number;
    /**
     * Ideally value between 0 to 1
     */
    readonly deltaTime: number;
}
