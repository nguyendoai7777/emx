import { ChangeDetectionStrategy, Component, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CategoryService } from '@pages/category/category.service';
import { DtoPagination } from '@emx/dto';
import { ProductCategory } from '@emx/types';
import { DatePipe } from '@angular/common';
import { CreateCategoryForm } from '@pages/category/components/create-category/create-category';
import { CButton } from '@ui/components';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'category',
  imports: [DatePipe, CreateCategoryForm, CButton, CdkMenu, CdkMenuItem, CdkContextMenuTrigger, MatButton],
  templateUrl: './category.html',
  styleUrl: './category.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: ``,
  },
})
export class CategoryPage {
  readonly formRef = viewChild.required(CreateCategoryForm);

  private readonly $$ = inject(CategoryService);

  readonly paginator = signal<DtoPagination>({
    page: 1,
    size: 20,
    search: '',
  });
  readonly data = signal<ProductCategory[]>([]);

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.$$.getList(this.paginator()).subscribe((res) => {
      this.data.set(res.data);
    });
  }
  headers = ['ID', 'Tên', 'Khóa', 'Tạo lúc', 'Cập nhật'];
  private create() {
    this.$$.create(this.formRef().form().controlValue()).subscribe({
      next: () => {
        this.getList();
      },
    });
  }

  private update() {
    this.$$.update(this.formRef().form().controlValue()).subscribe({});
  }

  createOrSave() {
    const selected = this.formRef().selectedCategory();
    if (selected) {
      this.update();
    } else {
      this.create();
    }
  }

  protected selectedCategory(b: ProductCategory) {
    this.formRef().setup(b);
  }

  readonly selectedCategoryItem = signal<ProductCategory>();

  protected selectedCategoryForMenu(b: ProductCategory | undefined) {
    this.selectedCategoryItem.set(b);
  }
}
