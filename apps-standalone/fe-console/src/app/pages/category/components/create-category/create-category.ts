import { ChangeDetectionStrategy, Component, output, signal, ViewEncapsulation } from '@angular/core';
import { CButton, FieldControl, TextField } from '@ui/components';
import { customError, Field, required, validate } from '@angular/forms/signals';
import { createForm, fieldError, markAllAsTouched } from '@common/utils';
import { Prettify, ProductCategory } from '@emx/types';
import { CreateCategoryFormProps } from '@common/types';

type Vx = Prettify<
  CreateCategoryFormProps & {
    variant: { id: number; name: string }[];
  }
>;

@Component({
  selector: 'create-category',
  imports: [Field, CButton, TextField, FieldControl],
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryForm {
  readonly enter = output();
  private readonly ____ = signal<Vx>({
    label: '',
    value: '',
    variant: [
      {
        id: 1,
        name: 'Buffalog',
      },
    ],
  });
  protected readonly fieldError = fieldError;
  selectedCategory = signal<ProductCategory>();
  readonly form = createForm(this.____, (p) => {
    required(p.label, { message: 'Nhập đi' });
    required(p.value, { message: 'Nhập đi' });
    validate(p.variant, (ctx) => {
      customError({
        message: '',
      });
    });
    validate(p, (ctx) => {
      ctx.field;
    });
    validate(p.value, (ctx) => {
      ctx.key;
    });
    /*createFieldValidator(p.variant, (ctx) => {
      console.log(`CF Array: `, { context: ctx.value() });
    });
    createFieldValidator(p, (ctx) => {
      console.log(`CF Root/Object: `, { context: ctx.value() });
    });
    createFieldValidator(p.value, (ctx) => {
      console.log(`CF Field: `, { context: ctx.field() });
    });*/
  });
  protected loading = signal(false);

  ngOnInit() {
    // Example usage:
    // markAllAsTouched(this.form);
    // markAllAsDirty(this.form);
  }

  setup(category: ProductCategory) {
    const selected = this.selectedCategory();
    const isSame = selected && selected.id === category.id;
    const { createdAt, updatedAt, ..._c } = category;
    if (isSame) {
      this.selectedCategory.set(void 0);
      this.form().setControlValue({ label: '', value: '', variant: [] });
    } else {
      this.selectedCategory.set(category);
      this.form().setControlValue({ ..._c, variant: [] });
    }
  }

  protected onAddVariant() {
    const current = this.form.variant().value();
    this.form.variant().setControlValue([
      ...current,
      {
        id: Date.now(),
        name: '',
      },
    ]);
  }

  protected onRemoveVariant(index: number) {
    const current = this.form.variant().value();
    this.form.variant().setControlValue(current.filter((_, i) => i !== index));
  }

  protected onTouchedAll() {
    markAllAsTouched(this.form);
  }
}
