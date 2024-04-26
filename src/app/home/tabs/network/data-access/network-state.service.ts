import { computed, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { map, Subject, switchMap } from 'rxjs';
import { FollowRequest } from 'src/app/model/follow-request';
import { FollowRequestsApiService } from 'src/app/services/api/follow-requests-api.service';

type networkState = {
	followRequests: FollowRequest[];
};
@Injectable()
export class NetworkStateService {
	// Services
	followRequestsApi = inject(FollowRequestsApiService);

	// State
	private state = signal<networkState>({
		followRequests: []
	});

	// Selectors
	public followRequests = computed(() => this.state().followRequests);

	// Action Sources (Subjects)
	public acceptFollowRequest = new Subject<string>();
	public declineFollowRequest = new Subject<string>();

	// Sources (Observables)
	private followRequests$ = this.followRequestsApi.getFollowRequests();
	private acceptFollowRequest$ = this.acceptFollowRequest.pipe(
		switchMap((username) => this.followRequestsApi.acceptFollowRequest(username).pipe(map(() => username)))
	);
	private declineFollowRequest$ = this.declineFollowRequest.pipe(
		switchMap((username) => this.followRequestsApi.declineFollowRequest(username).pipe(map(() => username)))
	);

	constructor() {
		connect(this.state)
			.with(this.followRequests$, (state, followRequests) => ({
				followRequests: followRequests
			}))
			.with(this.acceptFollowRequest$, (state, username) => ({
				followRequests: state.followRequests.filter((request) => request.requester !== username)
			}))
			.with(this.declineFollowRequest$, (state, username) => ({
				followRequests: state.followRequests.filter((request) => request.requester !== username)
			}));
	}
}
