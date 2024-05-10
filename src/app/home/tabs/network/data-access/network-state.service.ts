import { computed, inject, Injectable, signal } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { connect } from 'ngxtension/connect';
import { catchError, EMPTY, map, merge, Subject, switchMap, tap } from 'rxjs';
import { FollowRequest } from 'src/app/model/follow-request';
import { FollowRequestsApiService } from 'src/app/services/api/follow-requests-api.service';
import { ToastService } from 'src/app/services/toast.service';

type networkState = {
	followRequests: FollowRequest[];
	loading: boolean;
};

@Injectable()
export class NetworkStateService {
	// Services
	followRequestsApi = inject(FollowRequestsApiService);
	toastService = inject(ToastService);

	// State
	private state = signal<networkState>({
		followRequests: [],
		loading: false
	});

	// Selectors
	public followRequests = computed(() => this.state().followRequests);
	public loading = computed(() => this.state().loading);

	// Action Sources (Subjects)
	public acceptFollowRequest = new Subject<string>();
	public declineFollowRequest = new Subject<string>();
	public follow = new Subject<string>();
	public refresh = new Subject<RefresherCustomEvent>();

	// Sources (Observables)
	private followRequests$ = this.followRequestsApi.getFollowRequests();
	private refreshFollowRequests$ = this.refresh.pipe(
		tap((event) => event.target.complete()),
		switchMap(() => this.followRequestsApi.getFollowRequests())
	);
	private acceptFollowRequest$ = this.acceptFollowRequest.pipe(
		switchMap((username) => this.followRequestsApi.acceptFollowRequest(username).pipe(map(() => username)))
	);
	private declineFollowRequest$ = this.declineFollowRequest.pipe(
		switchMap((username) => this.followRequestsApi.declineFollowRequest(username).pipe(map(() => username)))
	);
	private follow$ = this.follow.pipe(
		switchMap((username) =>
			this.followRequestsApi.makeFollowRequests(username).pipe(
				map(() => username),
				catchError((e) => {
					this.toastService.error('You already requested to follow this user!');
					return EMPTY;
				})
			)
		),
		tap(() => this.toastService.success('Follow request sent!'))
	);

	constructor() {
		connect(this.state)
			.with(this.refresh, (state) => ({ loading: true }))
			.with(merge(this.followRequests$, this.refreshFollowRequests$), (state, followRequests) => ({
				followRequests: followRequests,
				loading: false
			}))
			.with(this.acceptFollowRequest$, (state, username) => ({
				followRequests: state.followRequests.filter((request) => request.requester !== username)
			}))
			.with(this.declineFollowRequest$, (state, username) => ({
				followRequests: state.followRequests.filter((request) => request.requester !== username)
			}))
			.with(this.follow$, (state, username) => ({}));
	}
}
