import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { FollowRequest, FollowRequestDto } from 'src/app/model/follow-request';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FollowRequestsApiService {
  auth = inject(AuthService);
  http = inject(HttpClient);

  constructor() {}

  getFollowRequests(): Observable<FollowRequest[]> {
    return this.http
      .get<FollowRequestDto[]>(environment.api.url + '/users/follow')
      .pipe(
        map((requests) => {
          return requests.map((request) => {
            return {
              requesterId: request.requester_id,
              requesteeId: request.requestee_id,
              status: request.status,
              timestamp: request.timestamp,
            };
          });
        })
      );
  }

  makeFollowRequests(userId: string): Observable<void> {
    return this.http.put<void>(
      `${environment.api.url}/users/${userId}/follow`,
      {}
    );
  }

  acceptFollowRequest(userId: string): Observable<void> {
    return this.http.put<void>(
      `${environment.api.url}/users/${userId}/follow?action=accept`,
      {}
    );
  }

  declineFollowRequest(userId: string): Observable<void> {
    return this.http.put<void>(
      `${environment.api.url}/users/${userId}/follow?action=decline`,
      {}
    );
  }
}
