import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { usePaginator } from './ng-paginator.hook';
import { NgPaginatorImpl } from './ng-paginator.types';

/**
 * @example
 *
 * ```ts
 *  @Component({
 *   ...
 *   imports: [NgPaginator],
 *   template: `
 *       <ng-paginator
 *          [(page)]="paginator().page"
 *          [size]="paginator().size"
 *          [totalRecords]="paginator().totalRecords"
 *       />
 *   `,
 *  })
 *  export class YourComponent {
 *    paginator = signal({ page: 1, size: 10, totalRecords: 1000 });
 *  }
 * ```
 *
 * or custom your-self paginator component re-use business
 *
 * @customize implementation example
 * ```ts
 * @Component({
 *   selector: 'your-paginator',
 *   templateUrl: `
 *      <div class="flex gap-0.5">
 *        @for (p of pg.pages(); track $index) {
 *          @let disabled = p === '...';
 *          <button
 *            [class.current]="page() === p"
 *            (click)="pg.goToPage(p)"
 *            [disabled]="disabled"
 *          >{{ p }}</button>
 *        }
 *      </div>
 *   `,
 *   encapsulation: ViewEncapsulation.None,
 * })
 * export class YourPaginator implements NgPaginatorImpl {
 *   readonly page = model(0);
 *   readonly size = input.required<number>();
 *   readonly totalRecords = input.required<number>();
 *
 *   readonly pg = usePaginator({
 *     page: this.page,
 *     size: this.size,
 *     totalRecords: this.totalRecords,
 *   });
 *
 *   /// your business here
 * }
 *```
 *
 * */
@Component({
  selector: 'ng-paginator',
  imports: [MatRipple],
  templateUrl: './ng-paginator.component.html',
  styleUrl: './ng-paginator.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgPaginator implements NgPaginatorImpl {
  readonly page = model(4);
  readonly size = input.required<number>();
  readonly totalRecords = input.required<number>();

  readonly pg = usePaginator({
    page: this.page,
    size: this.size,
    totalRecords: this.totalRecords,
  });
}
