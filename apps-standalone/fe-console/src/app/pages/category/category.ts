import { ChangeDetectionStrategy, Component, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CategoryService } from '@pages/category/category.service';
import { ProductCategory } from '@emx/types';
import { DatePipe } from '@angular/common';
import { CreateCategoryForm } from '@pages/category/components/create-category/create-category';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatButton } from '@angular/material/button';
import { useListBase } from '@common/abstracts';
import { NgPaginator } from '@components/paginator/ng-paginator.component';
import { CircularIndicator } from '@components/indicator-circular/indicator-circular.component';

@Component({
  selector: 'category',
  imports: [
    DatePipe,
    CreateCategoryForm,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger,
    MatButton,
    NgPaginator,
    CircularIndicator,
  ],
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
  protected lb = useListBase<ProductCategory>(`/category`);

  ngOnInit() {
    this.lb.getList();
  }

  headers = ['ID', 'Tên', 'Khóa', 'Tạo lúc', 'Cập nhật'];
  private create() {
    this.$$.create(this.formRef().form().controlValue()).subscribe({
      next: () => {
        this.lb.getList();
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
