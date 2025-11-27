import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'c-button',
  template: `
    <button [disabled]="disabled()" [class.w-full]="fullWidth()" matButton="elevated" class="rounded-lg!">
      <ng-content />
    </button>
  `,
  imports: [MatButton],
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
export class CButton {
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
}
