import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CircularIndicator } from '@components/indicator-circular/indicator-circular.component';

@Component({
  selector: 'c-button',
  template: `
    <button [disabled]="disabled()" [class.w-full]="fullWidth()" matButton="elevated" class="rounded-lg!">
      <div class="flex items-center relative">
        @if (loading()) {
          <indicator-circular size="20px" />
        }
        <div
          class="mt-0.5 duration-200 ease-in-out"
          [style.transform]="loading() ? 'translateX(6px)' : 'translateX(0)'"
        >
          <ng-content />
        </div>
      </div>
    </button>
  `,
  imports: [MatButton, CircularIndicator],
  encapsulation: ViewEncapsulation.None,
  host: { class: `block` },
  styles: `
    c-button {
      --mat-button-protected-container-height: var(--control-height);
      --mat-button-protected-container-shape: 4px;
      --mat-button-protected-container-color: rgba(0, 221, 221, 0.15);

      button {
        transition: 0.2s;

        .mdc-button__ripple,
        .mdc-button__label {
          &,
          &:before {
            transition: 0.2s;
          }
        }
      }
    }
  `,
})
class CButton {
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
}

export default CButton;
