import { ChangeDetectionStrategy, Component, output, signal, ViewEncapsulation } from '@angular/core';
import { TextField } from '@ui/components';
import { Field, required } from '@angular/forms/signals';
import { createForm, fieldError } from '@common/utils';
import { ProductCategory } from '@emx/types';
import { CreateCategoryFormProps } from '@common/types';

@Component({
  selector: 'create-category',
  imports: [TextField, Field],
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
  protected loading = signal(false);

  ngOnInit() {
    setInterval(() => {
      // this.loading.update((v) => !v);
      console.log(this.loading());
    }, 2000);
  }

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
