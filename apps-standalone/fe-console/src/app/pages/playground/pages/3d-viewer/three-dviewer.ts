import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'three-d-viewer',
  imports: [],
  templateUrl: './three-dviewer.html',
  styleUrl: './three-dviewer.css',
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThreeDViewer {}
