import { Component, computed, effect, input, model, ViewEncapsulation } from '@angular/core';
import { FormValueControl, provideSignalFormsConfig, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { ControlFieldKind } from '@emx/types';
import { StyleMapped } from '../../components/form/form-field.const';

@Component({
  selector: 'field-control-ex',
  imports: [],
  template: `
    <input
      #input
      class="block duration-250 rounded-lg content-center h-[var(--control-height)] px-2 border {{ rootClasses() }}"
      [value]="value()"
      [name]="name()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [class.invalid]="invalid()"
      [attr.aria-invalid]="invalid()"
      (input)="value.set(input.value)"
      (blur)="touched.set(true)"
    />
    @let error = comError();
    <div class="error-placeholder">
      @if (touched() || dirty()) {
        @if (error) {
          <div class="message-helper {{ error.kind === 'warning' ? 'warning' : 'error' }}" animate.leave="leaving">
            {{ error.message }}
          </div>
        }
      }
    </div>
  `,
  styleUrls: ['./field-control-ex.css'],
  encapsulation: ViewEncapsulation.None,
  host: {},
  providers: [
    provideSignalFormsConfig({
      classes: {
        'ng-invalid': ({ state }) => state().invalid(),
        'ng-touched': ({ state }) => state().touched(),
        'ng-untouched': ({ state }) => !state().touched(),
        'ng-dirty': ({ state }) => state().dirty(),
      },
    }),
  ],
})
export class FieldControlEx implements FormValueControl<string> {
  // Required
  value = model('');
  // Writable interaction state - control updates these
  touched = model(false);
  dirty = input(false);
  // Read-only state - form system manages these
  disabled = input(false);
  readonly = input(false);
  hidden = input(false);
  invalid = input(false);
  name = input('');
  readonly state = input<ControlFieldKind>('');

  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly comError = computed<WithOptionalField<ValidationError> | undefined>(() => {
    const error = this.errors();
    return error.length ? error.at(0) : void 0;
  });

  readonly rootClasses = computed(() => {
    const errorType = this.comError()?.kind ?? '';
    return this.dirty() || this.touched() ? ` ${StyleMapped[errorType]}` : '';
  });

  constructor() {}
}
