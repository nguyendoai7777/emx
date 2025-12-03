import { Component, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { useListBase } from '@common/abstracts';
import { ProductService } from '@pages/product/product.service';
import { packr } from '@common/services';

@Component({
  selector: 'product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductPage {
  lb = useListBase<{ id: number }>(`/product`);
  private readonly $$ = inject(ProductService);
  readonly file = signal<File>();

  constructor() {
    effect(() => {
      console.log(`alo `, this.lb.data());
    });
  }

  ngOnInit() {
    this.lb.getList();
  }

  protected sendTest() {
    const msg = {
      coordinates: [1, 5, 3, 5, 3, 7, 3],
      title: 'chart X',
      props: {
        name: 'test name',
        size: 1024,
        tags: ['admin', 'vip'],
        description: `This is a detailed description of the chart.`,
        bigNumber: 123123123,
      },
    };
    const packedMsg = packr.packer.pack(msg);
    this.$$.createProduct(packedMsg).subscribe({
      next: () => {},
    });
  }

  protected setFile(target: HTMLInputElement) {
    const file = target.files?.[0];
    if (file) {
      this.file.set(file);
    }
    console.log(`file`);
  }
}
