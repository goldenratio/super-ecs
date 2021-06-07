import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { Disposable, DisposeCallback } from './disposable';

export class DisposeBag implements Disposable {
  private _dispose$ = new Subject<void>();
  private _list = new Set<DisposeCallback>();

  add(item: Disposable | DisposeCallback) {
    this._list.add(() => {
      if (typeof item === 'function') {
        item();
      } else {
        item.dispose();
      }
    });
  }

  completable$<T>(item: Observable<T>): Observable<T> {
    return item.pipe(takeUntil(this._dispose$));
  }

  dispose() {
    this._dispose$.next();
    this._dispose$.complete();

    this._list.forEach(cb => cb());
    this._list.clear();
  }
}
