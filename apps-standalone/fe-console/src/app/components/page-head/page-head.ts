import { Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'page-head',
  imports: [],
  template: ` <span class="text-xl">{{ title() }}</span> `,
  styles: ``,
  host: {
    class: `block`,
  },
  encapsulation: ViewEncapsulation.None,
})
export class PageHead {
  private readonly router = inject(Router);
  readonly title = signal('');
  private readonly dr = inject(DestroyRef);
  ngOnInit() {
    this.router.events
      .pipe(
        startWith(null),
        filter((event) => event === null || event instanceof NavigationEnd),
        map(() => this.getDeepestChild(this.router.routerState.root)),
        takeUntilDestroyed(this.dr)
      )
      .subscribe((ar) => {
        this.title.set(ar.snapshot.title ?? '');
      });
  }
  private getDeepestChild(route: ActivatedRoute) {
    let child = route.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else {
        return child;
      }
    }
    return route;
  }
}
