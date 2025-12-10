import { Component, computed, contentChild, effect, ViewEncapsulation } from '@angular/core';
import { TextField } from '../text-field';

/**
 * must be used with a `text-field` as children
 *
 * ```html
 * <field-control>
 *   <text-field [...props] />
 * </field-control>
 * ```
 *
 * */
@Component({
  selector: 'field-control',
  imports: [],
  templateUrl: './field-control.html',
  styleUrl: './field-control.css',
  encapsulation: ViewEncapsulation.None,
})
export class FieldControl {
  textFieldCtrl = contentChild(TextField);
  textFieldError = computed(() => {
    const textField = this.textFieldCtrl();
    if (textField) {
      const touched = textField.touched();
      const error = textField.errors().at(0);
      if (touched && error) {
        return error.message;
      }
      return void 0;
    }
    return void 0;
  });
  constructor() {
    effect(() => {
      const textField = this.textFieldCtrl();
      if (textField) {
        const touched = textField.touched();
        const error = textField.errors().at(0);
        console.log({
          touched,
          error,
        });
      }
    });
  }

  ngAfterContentInit() {
    console.log(this.textFieldCtrl());
  }
}
