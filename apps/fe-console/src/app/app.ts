import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'angular',
  templateUrl: './app.html',
  host: {
    class: `block`,
  },
})
export class App {
  protected readonly title = signal('fe-console');
}
