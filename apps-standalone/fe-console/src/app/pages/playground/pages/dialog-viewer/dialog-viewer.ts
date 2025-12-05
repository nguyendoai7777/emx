import { Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-dialog-viewer',
  imports: [],
  templateUrl: './dialog-viewer.html',
  styleUrl: './dialog-viewer.css',
})
export class DialogViewer implements OnInit {
  // private readonly metadataService = inject(MetadataService);
  protected readonly count = signal(0);
  isShown = signal(false);
  toggle() {
    this.isShown.update((isShown) => !isShown);
  }
  ngOnInit() {
    // this.metadataService.setMetadata({
    //   title: 'Dialog Viewer Page',
    //   description: 'This is the Dialog Viewer page with strict metadata',
    //   authors: [{ name: 'Antigravity', url: 'https://example.com' }],
    //   keywords: ['Angular', 'SSR', 'Prerender', 'Metadata'],
    //   openGraph: {
    //     type: 'website',
    //     title: 'Dialog Viewer OG Title',
    //     description: 'OG Description for Dialog Viewer',
    //     images: ['https://example.com/og-image.jpg'],
    //   },
    //   twitter: {
    //     card: 'summary_large_image',
    //     site: '@antigravity',
    //     title: 'Dialog Viewer Twitter Title',
    //     description: 'Twitter Description',
    //   },
    //   facebook: {
    //     appId: '123456789',
    //   },
    // });
  }

  protected increment() {
    this.count.update((count) => count + 1);
  }

  protected decrement() {
    this.count.update((count) => count - 1);
  }
}
