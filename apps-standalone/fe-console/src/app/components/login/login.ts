import { Component, inject, signal } from '@angular/core';
import { CButton, TextField } from '@ui/components';
import { Field, form, required } from '@angular/forms/signals';
import { LoginFormProps } from '@components/login/login.types';
import { fieldError, markAllAsTouched } from '@common/utils';
import { AuthService } from '@common/services';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  imports: [TextField, CButton, Field],
  templateUrl: './login.html',
  styles: ``,
  host: {
    class: `block content-center px-4 w-100 border-r border-gray-600 min-h-[100svh]`,
  },
})
export class Login {
  private readonly auth$$ = inject(AuthService);
  private readonly router = inject(Router);
  private readonly __login__ = signal<LoginFormProps>({
    password: 'qaz123QAZ!@#',
    username: 'admin',
  });
  protected readonly loginForm = form(this.__login__, (p) => {
    required(p.username, { message: 'Nhập đi' });
    required(p.password, { message: 'Nhập đi' });
  });
  protected readonly fieldError = fieldError;
  login() {
    this.loginForm.password().markAsTouched();
    markAllAsTouched(this.loginForm);
    if (this.loginForm().valid()) {
      // console.log(`login de`, this.loginForm().value());
      this.auth$$.login(this.loginForm().value()).subscribe({
        next: () => {
          void this.router.navigateByUrl(`/`);
        },
      });
    } else {
      console.log(`invalid dau r`);
    }
  }
}
