import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ModelSignal,
  viewChild,
} from '@angular/core';
import { CastString, ControlFieldKind } from '@emx/types';
import { FieldTree, FormValueControl } from '@angular/forms/signals';
import { StyleMapped } from '../form-field.const';
import { HTMLInputTypeAttribute } from 'react';

const inferWithUndefined = (value: unknown) => {
  const v = value;
  if (v === '' || !v) {
    return void 0;
  }
  return v;
};

@Directive({
  host: {
    '[attr.touched]': 'comTouched()',
    '[attr.invalid]': 'comError()',
  },
})
export class InputField<T extends number | string | null> implements FormValueControl<T> {
  value: ModelSignal<T>;

  readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly field = input.required<FieldTree<T, string>>();
  readonly type = input<CastString<HTMLInputTypeAttribute | ''>>('text');
  readonly placeholder = input('');
  readonly inputMode = input<
    'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'and' | 'search' | ''
  >();
  // Styling
  /**
   * `fullWidth` or `fullWidth="false"`
   * */
  readonly fullWidth = input(true, { transform: booleanAttribute });
  readonly state = input<ControlFieldKind>('');

  private readonly elr = inject<ElementRef<HTMLElement>>(ElementRef);

  // Access to input element
  readonly inferInputMode = computed(() => {
    return inferWithUndefined(this.inputMode());
  });
  protected readonly inferType = computed(() => {
    return inferWithUndefined(this.type());
  });
  protected readonly inferPlaceholder = computed(() => {
    return inferWithUndefined(this.placeholder());
  });
  readonly comTouched = computed(() => (this.field()().touched() ? '' : void 0));
  readonly comError = computed(() => {
    const error = this.field()().errors();
    return error.length ? error.at(0)?.message : void 0;
  });
  readonly comState = computed<ControlFieldKind>(() => {
    const manualState = this.state();
    if (manualState !== '') {
      return manualState;
    }
    const field = this.field()();
    const isTouched = field.touched();
    const isDirty = field.dirty();
    const errorList = field.errors();
    if ((isTouched || isDirty) && errorList.length > 0) {
      const firstError = errorList[0];
      return firstError.kind === 'warning' ? 'warning' : 'error';
    }
    return '';
  });
  readonly rootClasses = computed(() => `${this.fullWidth() ? 'w-full ' : ''} ${StyleMapped[this.comState()]}`);

  focus() {
    this.inputElement().nativeElement.focus();
  }
}
