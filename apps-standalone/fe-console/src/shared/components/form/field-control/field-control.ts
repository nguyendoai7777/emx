import { Component, computed, contentChild, ViewEncapsulation } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { NumberField, TextField } from '../input-field';

/**
 * must be used with a `text-field` as children
 *
 * ```html
 * <field-control>
 *   <text-field [field]="form.name" />
 * </field-control>
 * ```
 *
 * */
@Component({
  selector: 'field-control',
  imports: [],
  template: `
    <ng-content select="text-field" />
    @let error = textFieldError();
    <div class="error-placeholder">
      @if (error) {
        <div class="message-helper {{ error.kind === 'warning' ? 'warning' : 'error' }}" animate.leave="leaving">
          {{ error.message }}
        </div>
      }
    </div>
  `,
  styleUrl: './field-control.css',
  encapsulation: ViewEncapsulation.None,
})
export class FieldControl {
  textFieldCtrl = contentChild(TextField);
  numberFieldCtrl = contentChild(NumberField);

  textFieldError = computed<ValidationError | undefined>(() => {
    const textField = this.textFieldCtrl() || this.numberFieldCtrl();
    if (textField) {
      const field = textField.field()();
      const touched = field.touched();
      const dirty = field.dirty();
      const error = field.errors().at(0);
      if ((touched || dirty) && error) {
        return error;
      }
      return void 0;
    }
    return void 0;
  });
}
