import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {User, UserDto} from 'src/app/model/user';
import {environment} from 'src/environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class ProfileApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {
  }

  getProfile(userId?: string): Observable<User> {
    return this.http.get<UserDto>(environment.api.url + '/users' + (userId ? `/${userId}` : '')).pipe(
      map((user) => {
        return {
          userId: user.user_id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      })
    )
  }

  getProfilesByNamePrefix(prefix: string): Observable<User[]> {
    if (!prefix) {
      return of([]);
    }
    return this.http
      .get<UserDto[]>(environment.api.url + '/users/search', {
        params: {username: prefix},
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
    return this.http
      .put<UserDto>(environment.api.url + '/users', {
        first_name: user.first_name,
        last_name: user.last_name,
      })
      .pipe(
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
