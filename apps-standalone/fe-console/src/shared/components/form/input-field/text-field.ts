import { Component, model, ViewEncapsulation } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { InputField } from './input-field';

@Component({
  selector: 'text-field',
  imports: [Field],
  template: `
    <input
      #input
      class="block duration-250 rounded-lg content-center h-[var(--control-height)] px-2 border {{ rootClasses() }}"
      [field]="field()"
      (input)="onInput($event)"
      [attr.type]="inferType()"
      [attr.inputmode]="inferInputMode()"
      [attr.placeholder]="inferPlaceholder()"
    />
  `,
  host: {
    '[attr.touched]': 'comTouched()',
    '[attr.invalid]': 'comError()',
  },
  encapsulation: ViewEncapsulation.None,
})
export class TextField extends InputField<string | number | null> {
  override readonly value = model('' as string | number | null);

  protected onInput(e: Event) {
    const tg = e.target as HTMLInputElement;
    console.log(tg.valueAsNumber);
    console.log(tg.value);
  }
}
