import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import MainRoutes from '@ui/routes/main.routes';
import { extractRoutes } from '@common/utils';

@Component({
  selector: 'main-sidenav',
  imports: [MatNavList, MatListItem, RouterLinkActive, RouterLink],
  templateUrl: './main-sidenav.html',
  styleUrl: `./main-sidenav.scss`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': "`px-2 ${reverse() ? ' reverse' : ''}`",
  },
})
export class MainSidenav {
  readonly reverse = signal(true);
  protected readonly SideList = extractRoutes(MainRoutes);
}
