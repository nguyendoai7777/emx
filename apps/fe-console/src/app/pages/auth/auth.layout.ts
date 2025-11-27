import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth',
  template: ` <router-outlet /> `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: `flex`,
  },
  imports: [RouterOutlet],
})
class AuthLayout {}

export default AuthLayout;
