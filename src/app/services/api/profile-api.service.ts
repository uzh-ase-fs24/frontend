import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  // TODO: Remove this when the API is ready
  profilePosted = false;

  constructor() {}

  // TODO: Add profile type
  getProfile(): Observable<any> {
    return this.profilePosted
      ? of({ username: 'test' })
      : throwError(() => new HttpErrorResponse({ status: 404 }));

    // return this.auth.getUser().pipe(
    //   tap((profile) => console.log('Profile:', profile)),
    //   switchMap((user) => this.http.get(environment.api.url + '/users/2'))
    // );
  }

  postProfile(user: User): Observable<User> {
    this.profilePosted = true;
    return of(user);
    // return this.http.post<User>(environment.api.url + '/users', user);
  }
}
