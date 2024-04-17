import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FollowRequest, FollowRequestDto } from 'src/app/model/follow-request';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class FollowRequestsApiService {
	auth = inject(AuthService);
	http = inject(HttpClient);

	constructor() {}

	getFollowRequests(): Observable<FollowRequest[]> {
		return this.http.get<FollowRequestDto[]>(environment.api.url + '/users/follow').pipe(
			map((requests) => {
				return requests.map((request) => {
					return {
						requesterUsername: request.requester_username,
						requesterId: request.requester_id,
						requesteeId: request.requestee_id,
						status: request.status,
						timestamp: request.timestamp
					};
				});
			})
		);
	}

	makeFollowRequests(userId: string): Observable<void> {
		return this.http.put<void>(`${environment.api.url}/users/${userId}/follow`, {});
	}

	acceptFollowRequest(userId: string): Observable<void> {
		return this.http.patch<void>(`${environment.api.url}/users/${userId}/follow?action=accept`, {});
	}

	declineFollowRequest(userId: string): Observable<void> {
		return this.http.patch<void>(`${environment.api.url}/users/${userId}/follow?action=decline`, {});
	}
}
