import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlFieldState } from '@emx/types';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'text-field',
  imports: [],
  template: `
    <input
      [type]="type()"
      #input
      (input)="value.set($any($event.target).value)"
      [placeholder]="placeholder()"
      class="w-full"
      [value]="value()"
      (blur)="touched.set(true)"
    />
  `,
  host: {
    '[class]': '`block duration-250 rounded-lg content-center h-[var(--control-height)] px-2 border ${rootClasses()}`',
  },
  styles: `
    text-field {
      input {
        &:focus-visible {
          outline: none;
        }

        &::placeholder {
          font-size: 12px;
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class TextField implements FormValueControl<string> {
  readonly value = model('');
  readonly touched = model(false);
  // invalid?: InputSignal<boolean> | undefined;
  readonly invalid = input(false);
  readonly type = input<'text' | 'password'>('text');
  errors?: InputSignal<readonly WithOptionalField<ValidationError>[]> | undefined;
  disabled?: InputSignal<boolean> | undefined;
  disabledReasons?: InputSignal<readonly WithOptionalField<DisabledReason>[]> | undefined;
  readonly?: InputSignal<boolean> | undefined;
  pending?: InputSignal<boolean> | undefined;
  dirty?: InputSignal<boolean> | undefined;
  name?: InputSignal<string> | undefined;
  required?: InputSignal<boolean> | undefined;
  min?: InputSignal<number | undefined> | undefined;
  minLength?: InputSignal<number | undefined> | undefined;
  max?: InputSignal<number | undefined> | undefined;
  maxLength?: InputSignal<number | undefined> | undefined;
  pattern?: InputSignal<readonly RegExp[]> | undefined;

  readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly fullWidth = input(true, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly state = input<ControlFieldState>('normal');
  readonly rootClasses = computed(() => `${this.fullWidth() ? 'w-full ' : ''} ${this.styleMapped[this.state()]}`);
  private readonly elr = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly styleMapped: Record<ControlFieldState, any> = {
    normal: `border-gray-500 has-[:focus-visible]:border-gray-400 hover:border-gray-400`,
    error: `border-red-500 has-[:focus-visible]:border-red-400 hover:border-red-400`,
    warning: `border-orange-400 has-[:focus-visible]:border-orange-300 hover:border-orange-300`,
  };
  focus() {
    this.inputElement().nativeElement.focus();
  }
  constructor() {
    effect(() => {
      if (this.invalid()) {
        this.elr.nativeElement.setAttribute('aria-invalid', '');
      } else {
        this.elr.nativeElement.removeAttribute('aria-invalid');
      }
    });
    effect(() => {
      if (this.touched()) {
        this.elr.nativeElement.setAttribute('aria-touched', '');
      } else {
        this.elr.nativeElement.removeAttribute('aria-touched');
      }
    });
  }
}
