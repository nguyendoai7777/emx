import { Component, computed, model, ViewEncapsulation } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { InputField } from './input-field';

const inferWithUndefined = (value: unknown) => {
  const v = value;
  if (v === '' || !v) {
    return void 0;
  }
  return v;
};

@Component({
  selector: 'number-field',
  imports: [Field],
  template: `
    <input
      #input
      class="block duration-250 rounded-lg content-center h-[var(--control-height)] px-2 border {{ rootClasses() }}"
      [field]="field()"
      (input)="onInput($event)"
      [attr.type]="'text'"
      [attr.inputmode]="'numeric'"
      [attr.placeholder]="inferPlaceholder()"
    />
  `,
  styleUrl: './input-field.css',
  encapsulation: ViewEncapsulation.None,
})
export class NumberField extends InputField<number | null> {
  override readonly value = model<number | null>(null);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove non-numeric characters (allow digits, dot, minus)
    value = value.replace(/[^0-9.-]/g, '');

    // Enforce max length manually
    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    if (value !== input.value) {
      input.value = value;
    }

    const numValue = value === '' || value === '-' ? null : +value;
    this.value.set(numValue);
  }
}
