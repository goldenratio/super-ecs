export interface Disposable {
	dispose(): void;
}

export type DisposeCallback = () => void;
