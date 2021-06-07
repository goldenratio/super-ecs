import { Observable } from 'rxjs';
import { Disposable, DisposeCallback } from './disposable';
export declare class DisposeBag implements Disposable {
    private _dispose$;
    private _list;
    private _isDisposed;
    add(item: Disposable | DisposeCallback): void;
    completable$<T>(item: Observable<T>): Observable<T>;
    dispose(): void;
}
