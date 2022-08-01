import { Component, Inject, inject, InjectionToken, OnInit, VERSION } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, Observable, pluck } from 'rxjs';

function filterNil() {
  return function<T>(source: Observable<T>): Observable<T> {
    return new Observable(subscriber => {
      source.subscribe({
        next(value) {
          if(value !== undefined && value !== null) {
            subscriber.next(value);
          }
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      })
    });
  }
}

export type TimespanProvider = Observable<string>;

export const TIMESPAN = new InjectionToken('Subscribe to timespan query param', {
  factory() {
    const activatedRoute = inject(ActivatedRoute);

    return activatedRoute.queryParams.pipe(
      pluck('timespan'),
      filterNil(),
      distinctUntilChanged()
    );
  },
});

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  constructor(@Inject(TIMESPAN) private timespan$: TimespanProvider) {}

  ngOnInit() {
    this.timespan$.pipe(untilDestroyed(this)).subscribe(console.log);
  }
}
