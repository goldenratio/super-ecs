import { Observable, Subscriber } from 'rxjs';

import { Disposable, DisposeBag } from './src/utils/dispose-bag';

describe('DisposeBag Test', () => {
  it('should dispose DisposeCallback or Disposable', () => {
    let isDisposeCalled = false;
    let isTestFooDisposeCalled = false;

    class TestFoo implements Disposable {
      dispose(): void {
        isTestFooDisposeCalled = true;
      }
    }

    const disposeBag = new DisposeBag();
    disposeBag.add(() => {
      isDisposeCalled = true;
    });
    disposeBag.add(new TestFoo());
    disposeBag.dispose();

    expect(isTestFooDisposeCalled).toBe(true);
    expect(isDisposeCalled).toBe(true);
  });

  it('should dispose Observable', () => {
    let isDisposeCalled = false;
    const obs$ = Observable.create();

    const disposeBag = new DisposeBag();
    disposeBag.completable$(obs$).subscribe({
      complete: () => {
        isDisposeCalled = true;
      }
    });
    disposeBag.dispose();

    expect(isDisposeCalled).toBe(true);
  });

  it('should throw when using already disposed DisposeBag', () => {
    const obs$ = Observable.create();
    const disposeBag = new DisposeBag();
    disposeBag.dispose();
    expect(() => disposeBag.completable$(obs$)).toThrowError();
  });

  it('should be current payload with toPromise', async () => {
    const obs$ = Observable.create((observer: Subscriber<boolean>) => observer.next(true));
    let payload: unknown = false;
    const disposeBag = new DisposeBag();
    await disposeBag.toPromise(obs$).then(value => (payload = value));
    expect(payload).toBe(true);
  });
});
