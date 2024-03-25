import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {}

  getProfile(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) =>
        this.http.get(
          environment.api.url + '/users/' + user?.sub?.split('|')[1]
        )
      )
    );
  }

  postProfile(user: User): Observable<User> {
    return this.http.post<User>(environment.api.url + '/users', user);
  }
}
