import { Component, ViewEncapsulation } from '@angular/core';
import { MainSidenav } from '@components/main-sidenav/main-sidenav';
import { RouterOutlet } from '@angular/router';
import { PageHead } from '@components';

@Component({
  selector: 'main-layout',
  imports: [MainSidenav, RouterOutlet, PageHead],
  templateUrl: `./main.layout.html`,
  styleUrl: `./main.layout.css`,
  host: {
    class: `flex`,
  },
  encapsulation: ViewEncapsulation.None,
})
class MainLayout {}
export default MainLayout;
