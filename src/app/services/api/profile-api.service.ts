import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { User, UserDto } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {}

  getProfile(): Observable<User> {
    return this.auth.user$.pipe(
      switchMap((user) =>
        this.http.get<UserDto>(environment.api.url + '/users').pipe(
          map((user) => {
            return {
              userId: user.user_id,
              username: user.username,
              firstName: user.first_name,
              lastName: user.last_name,
            };
          })
        )
      )
    );
  }

  getProfilesByNamePrefix(prefix: string): Observable<User[]> {
    if (!prefix) {
      return of([]);
    }
    return this.http
      .get<UserDto[]>(environment.api.url + '/users/search', {
        params: { username: prefix },
      })
      .pipe(
        map((users) => {
          return users.map((user) => {
            return {
              userId: user.user_id,
              username: user.username,
              firstName: user.first_name,
              lastName: user.last_name,
            };
          });
        })
      );
  }

  postProfile(user: UserDto): Observable<User> {
    return this.http.post<UserDto>(environment.api.url + '/users', user).pipe(
      map((user) => {
        return {
          userId: user.user_id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      })
    );
  }

  updateProfile(user: UserDto): Observable<User> {
    return this.http.put<UserDto>(environment.api.url + '/users', user).pipe(
      map((user) => {
        return {
          userId: user.user_id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      })
    );
  }
}
