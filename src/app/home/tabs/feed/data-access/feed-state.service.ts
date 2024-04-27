import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { share, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/model/user';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';
import { ProfileApiService } from '../../../../services/api/profile-api.service';

type FeedState = {
	locationRiddles: LocationRiddle[];
	user: User | null;
	riddlesLoading: boolean;
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
		user: null,
		riddlesLoading: true
	});

	// Selectors
	public username = computed(() => this.state().user?.username);
	public locationRiddles = computed(() => this.state().locationRiddles);
	public loading = computed(() => this.state().riddlesLoading || !this.username());

	// Action Sources (Subjects)
	public refresh = new Subject<void>();
	public submitGuess = new Subject<{ locationRiddleId: string; guess: Coordinate }>();
	public rateLocationRiddle = new Subject<RateEvent>();

	// Sources (Observables)
	private userSource$ = this.profileApiService.getProfile();
	private locationRiddlesSource$ = this.locationRiddleApiService.getLocationRiddles().pipe(share());
	private refreshLocationRiddlesSource$ = this.refresh.pipe(switchMap(() => this.locationRiddlesSource$));
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(({ locationRiddleId, guess }) => this.locationRiddleApiService.postGuess(locationRiddleId, guess))
	);
	private rateLocationRiddleSource$ = this.rateLocationRiddle.pipe(
		switchMap((event) => this.locationRiddleApiService.rateLocationRiddle(event.locationRiddleId, event.rating))
	);

	constructor() {
		// Reducers
		connect(this.state)
			.with(this.userSource$, (state, user) => ({ user: user }))
			.with(this.locationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles,
				riddlesLoading: false
			}))
			.with(this.refreshLocationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles
			}))
			.with(this.submitGuessSource, (state, guessResult) => ({
				locationRiddles: state.locationRiddles.map((riddle) =>
					riddle.locationRiddleId === guessResult.locationRiddle.locationRiddleId
						? guessResult.locationRiddle
						: riddle
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
