import { ChangeDetectionStrategy, Component, output, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CButton, TextField } from '@ui/components';
import { Field, required } from '@angular/forms/signals';
import type { DtoCategory } from '@emx/dto';
import { createForm, fieldError } from '@common/utils';
import { ProductCategory } from '@emx/types';
import { uuid } from '@emx/core';
import { CreateCategoryFormProps } from '@common/types';

@Component({
  selector: 'create-category',
  imports: [TextField, Field, CButton],
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryForm {
  readonly enter = output<void>();
  private readonly ____ = signal<CreateCategoryFormProps>({
    label: '',
    value: '',
  });
  protected readonly fieldError = fieldError;
  selectedCategory = signal<ProductCategory>();
  readonly form = createForm(this.____, (p) => {
    required(p.label, { message: 'Nhập đi' });
    required(p.value, { message: 'Nhập đi' });
  });

  setup(category: ProductCategory) {
    const selected = this.selectedCategory();
    const isSame = selected && selected.id === category.id;
    const { createdAt, updatedAt, ..._c } = category;
    if (isSame) {
      this.selectedCategory.set(void 0);
      this.form().setControlValue({ label: '', value: '' });
    } else {
      this.selectedCategory.set(category);
      this.form().setControlValue(_c);
    }
  }
}
