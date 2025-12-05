import { ChangeDetectionStrategy, Component, computed, input, numberAttribute, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'indicator-circular',
  imports: [],
  template: `
    <svg class="circular-loader" viewBox="25 25 50 50">
      <circle
        class="loader-path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        style="stroke: var(--primary-color, var(--mat-sys-primary, #3daaff))"
        [attr.stroke-width]="strokeWidth()"
      />
    </svg>
  `,
  styles: `
    @keyframes NgIndicatorCircularRotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes NgIndicatorCircularDash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    indicator-circular {
      .circular-loader {
        animation: NgIndicatorCircularRotate 2s linear infinite;
        height: 100%;
        transform-origin: center center;
        width: 100%;
      }

      .loader-path {
        stroke-dasharray: 150, 200;
        stroke-dashoffset: -10;
        animation: NgIndicatorCircularDash 1.5s ease-in-out infinite
          /*, NgLoadingCircularColor 2s ease-in-out infinite*/;
        stroke-linecap: round;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style]': `styling()`,
  },
})
export class CircularIndicator {
  /**
   * css unit
   * */
  readonly size = input('50px');
  readonly strokeWidth = input(3, { transform: numberAttribute });
  /**
   * use for transform color when rorate
   * */
  protected readonly styling = computed(() => {
    return `width: ${this.size()};min-width: ${this.size()}; height: ${this.size()};`;
  });
}
