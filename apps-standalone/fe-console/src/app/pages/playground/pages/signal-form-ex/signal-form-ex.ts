import { Component, signal, ViewEncapsulation } from '@angular/core';
import { createCustomError, createFieldValidator, createForm } from '@common/utils';
import { NumberField, TextField } from '@ui/components';
import { MatButton } from '@angular/material/button';
import { required } from '@angular/forms/signals';

@Component({
  selector: 'signal-form-ex',
  imports: [TextField, NumberField, MatButton],
  templateUrl: './signal-form-ex.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class SignalFormEx {
  readonly user = signal({
    name: '',
    age: 18,
    email: 'julietjr@gmail.com',
  });

  form = createForm(this.user, (p) => {
    required(p.name, { message: 'required' });
  });

  protected onSubmit() {
    console.log(this.form().value().age);
  }
}
