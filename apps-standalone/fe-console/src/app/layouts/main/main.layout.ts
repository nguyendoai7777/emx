import { Component, ViewEncapsulation } from '@angular/core';
import { MainSidenav } from '@components/main-sidenav/main-sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'main-layout',
  imports: [MainSidenav, RouterOutlet],
  templateUrl: `./main.layout.html`,
  styleUrl: `./main.layout.css`,
  host: {
    class: `flex`,
  },
  encapsulation: ViewEncapsulation.None,
})
class MainLayout {}
export default MainLayout;
