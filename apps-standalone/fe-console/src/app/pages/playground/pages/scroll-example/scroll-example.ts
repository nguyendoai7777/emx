import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-example',
  imports: [],
  templateUrl: './scroll-example.html',
  styleUrl: './scroll-example.css',
})
export class ScrollExample {
  items = Array.from({ length: 10 }, (_, i) => i + 1);
}
