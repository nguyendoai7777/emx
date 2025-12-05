import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'c-playground',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './playground.html',
  styles: ``,
})
export class Playground {
  protected readonly title = signal('v21');
  private readonly router = inject(Router);

  constructor() {
    let currentIndex = 0;

    // Logic to determine navigation direction for View Transitions
    // We use afterNextRender to ensure this only runs on the client
    afterNextRender(() => {
      this.router.events.pipe(filter((event) => event instanceof RoutesRecognized)).subscribe((event) => {
        const nextIndex = event.state.root.firstChild?.data['animation'] ?? 0;
        const direction = nextIndex > currentIndex ? 'forward' : 'backward';

        // Update classes
        const root = document.documentElement;
        root.classList.remove('forward', 'backward');
        if (nextIndex !== currentIndex) {
          root.classList.add(direction);
        }

        currentIndex = nextIndex;
      });
    });
  }
}
