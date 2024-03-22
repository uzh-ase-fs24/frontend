import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {}

  // TODO: Add profile type, use auth0 user id
  getProfile(): Observable<any> {
    return this.auth.user$.pipe(
      tap((profile) => console.log('Profile:', profile)),
      switchMap((user) => this.http.get(environment.api.url + '/users/2'))
    );
  }

  postProfile(user: User): Observable<User> {
    return this.http.post<User>(environment.api.url + '/users', user);
  }
}
