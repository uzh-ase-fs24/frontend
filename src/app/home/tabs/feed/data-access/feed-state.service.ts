import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { share, Subject, switchMap, tap } from 'rxjs';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';
import { ProfileApiService } from '../../../../services/api/profile-api.service';

type FeedState = {
	locationRiddles: LocationRiddle[];
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
		loading: true
	});

	// Selectors
	public locationRiddles = computed(() => this.state().locationRiddles);
	public loading = computed(() => this.state().loading);

	// Action Sources (Subjects)
	public refresh = new Subject<void>();
	public submitGuess = new Subject<{ locationRiddleId: string; guess: Coordinate }>();
	public rateLocationRiddle = new Subject<RateEvent>();

	// Sources (Observables)
	private locationRiddlesSource$ = this.locationRiddleApiService.getLocationRiddles().pipe(share());
	private refreshLocationRiddlesSource$ = this.refresh.pipe(switchMap(() => this.locationRiddlesSource$));
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(({ locationRiddleId, guess }) => this.locationRiddleApiService.postGuess(locationRiddleId, guess)),
		tap((response) => console.log(response))
	);
	private rateLocationRiddleSource$ = this.rateLocationRiddle.pipe(
		switchMap((event) => this.locationRiddleApiService.rateLocationRiddle(event.locationRiddleId, event.rating)),
		tap((response) => console.log(response))
	);

	constructor() {
		// Reducers
		connect(this.state)
			.with(this.locationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles,
				loading: false
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
