import { Component, signal } from '@angular/core';
import { ExSignalForm } from '@pages/playground/pages/ex-signal-form/ex-signal-form';

@Component({
  selector: 'app-named-timeline',
  imports: [ExSignalForm],
  templateUrl: './named-timeline.html',
  styleUrl: './named-timeline.css',
})
export class NamedTimeline {
  items = Array.from({ length: 10 }, (_, i) => i + 1);
  progress = signal(0);

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    this.progress.set(Math.round(scrollPercentage));
  }
}
