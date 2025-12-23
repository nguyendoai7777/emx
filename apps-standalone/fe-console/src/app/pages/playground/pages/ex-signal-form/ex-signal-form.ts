import { Component, signal, ViewEncapsulation } from '@angular/core';
import { Field, required } from '@angular/forms/signals';
import { FieldControlEx } from '@ui/components/experimental';
import { createCustomError, createFieldValidator, createForm } from '@common/utils';

@Component({
  selector: 'ex-signal-form',
  imports: [FieldControlEx, Field],
  template: `
    <label>
      <div>VPPBank:</div>
      <field-control-ex [field]="form.name" />
    </label>
  `,
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class ExSignalForm {
  readonly user = signal({
    name: '',
  });

  form = createForm(this.user, (p) => {
    required(p.name, { error: { kind: 'error', message: 'Anh k biet nua' } });
    createFieldValidator(p.name, (ctx) => {
      const v = ctx.value();
      console.log(`VPB`, { v });
      if (v.length < 3) {
        return createCustomError({
          message: 'minlength = 3',
          kind: 'error',
        });
      }
      return null;
    });
  });
}
