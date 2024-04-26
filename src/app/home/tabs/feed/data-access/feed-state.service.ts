import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { forkJoin, map, mergeAll, share, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/model/user';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';
import { ProfileApiService } from '../../../../services/api/profile-api.service';

type FeedState = {
	locationRiddles: LocationRiddle[];
	users: User[];
	loading: boolean;
};

type RateEvent = { locationRiddleId: string; rating: number };

@Injectable()
export class FeedStateService {
	// Services
	locationRiddleApiService = inject(LocationRiddleApiService);
	profileApiService = inject(ProfileApiService);

	// State
	private state = signal<FeedState>({
		locationRiddles: [],
		users: [],
		loading: true
	});

	// Selectors
	public locationRiddles = computed(() => this.state().locationRiddles);
	public users = computed(() => this.state().users);
	public loading = computed(() => this.state().loading);

	// Action Sources (Subjects)
	public refresh = new Subject<void>();
	public submitGuess = new Subject<{ locationRiddleId: string; guess: Coordinate }>();
	public rateLocationRiddle = new Subject<RateEvent>();

	// Sources (Observables)
	private locationRiddlesSource$ = this.locationRiddleApiService.getLocationRiddles().pipe(share());
	private usersSource$ = this.locationRiddlesSource$.pipe(
		map((locationRiddles) =>
			forkJoin(
				locationRiddles.map((locationRiddle) =>
					this.profileApiService.getProfile(locationRiddle.username || '')
				)
			)
		),
		mergeAll()
	);
	private refreshLocationRiddlesSource$ = this.refresh.pipe(switchMap(() => this.locationRiddlesSource$));
	private refreshUsersSource$ = this.refresh.pipe(switchMap(() => this.usersSource$));
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(({ locationRiddleId, guess }) => this.locationRiddleApiService.postGuess(locationRiddleId, guess))
	);
	private rateLocationRiddleSource$ = this.rateLocationRiddle.pipe(
		switchMap((event) => this.locationRiddleApiService.rateLocationRiddle(event.locationRiddleId, event.rating))
	);

	constructor() {
		// Reducers
		connect(this.state)
			.with(this.locationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles,
				loading: locationRiddles.length !== 0
			}))
			.with(this.usersSource$, (state, users) => ({
				users: users,
				loading: false
			}))
			.with(this.refreshLocationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles
			}))
			.with(this.refreshUsersSource$, (state, users) => ({
				users: users
			}))
			.with(this.submitGuessSource, (state, updatedRiddle) => ({
				locationRiddles: state.locationRiddles.map((riddle) =>
					riddle.locationRiddleId === updatedRiddle.locationRiddleId ? updatedRiddle : riddle
				)
			}))
			.with(this.rateLocationRiddleSource$, (state, updatedLocationRiddle) => ({
				locationRiddles: state.locationRiddles.map((riddle) =>
					riddle.locationRiddleId === updatedLocationRiddle.locationRiddleId ? updatedLocationRiddle : riddle
				)
			}));

		effect(() => console.info('Feed State Change: ', this.state()));
	}
}
