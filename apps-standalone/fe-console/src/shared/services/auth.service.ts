import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, ResponseBase } from '@emx/types';
import { tap } from 'rxjs';
import { LocalStorageKey } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(payload: any) {
    return this.http.post<ResponseBase<LoginResponse>>(`/auth/console/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem(LocalStorageKey.accessToken, res.data.accessToken);
      })
    );
  }
}
