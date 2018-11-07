import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, NEVER, Subject, timer } from 'rxjs';
import { filter, map, pluck, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { RakiService } from 'src/app/rijks/raki.service';
import { QuoteService } from '../quote/quote.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vm-home',
  templateUrl: './vm-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmHomeComponent implements OnInit {
  init$ = new Subject<void>();
  @ViewChild('ba', { read: ElementRef }) ba;
  @ViewChild('bq', { read: ElementRef }) bq;
  @ViewChild('speed', { read: ElementRef }) speedRef;

  art$ = this.raki.randomImage$.pipe(filter(Boolean));

  baClicks$ = this.refClickToggle('ba');
  bqClicks$ = this.refClickToggle('bq');
  speed$ = this.refEvent('speedRef', 'change').pipe(
    pluck('target', 'value'),
    map(x => +x),
    startWith(3.5),
    tap(r => console.log('speed', r)),
    // shareReplay(1),  // Solution?
  );

  quote$ = this.speed$.pipe(
    switchMap(seconds =>
      this.q.RandomQuoteOnIntervalObs(seconds * 1000).pipe(filter(Boolean))
    )
  );

  pauseQuote$ = this.bqClicks$.pipe(switchMap(b => (b ? NEVER : this.quote$)));

  pausedArt$ = this.baClicks$.pipe(switchMap(b => (b ? NEVER : this.art$)));

  countDown$ = this.pausedArt$.pipe(
    switchMap(() => timer(0, 1000)),
    scan((duration, t) => 20 - t)
  );

  constructor(private raki: RakiService, private q: QuoteService) {}

  refClickToggle(name: string) {
    return this.refEvent(name, 'click').pipe(
      scan(acc => !acc, false),
      startWith(false),
      tap(r => console.log(name, r))
    );
  }

  refEvent(name: string, eventName: string) {
    return this.init$.pipe(
      switchMap(() => fromEvent(this[name].nativeElement, eventName)),
      tap(() => console.log(name, eventName))
    );
  }

  ngOnInit() {
    // also, it gives the ui some time to settle
    setTimeout(() => this.init$.next(), 10);
  }
}
