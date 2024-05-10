import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { merge, Subject, switchMap } from 'rxjs';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';

type LocationRiddleState = {
	showMap: boolean;
	marker: Coordinate | null;
	submitted: boolean;
	mapZoom: number;
	mapCenter: Coordinate | undefined;
	locationRiddle: LocationRiddle | undefined;
	loggedInUsername: string | undefined;
	achievedRating: number | undefined;
};

@Injectable()
export class LocationRiddleStateService {
	// Services
	private locationRiddleApiService = inject(LocationRiddleApiService);
	private authService = inject(AuthService);
	private toastService = inject(ToastService);

	// State
	private state = signal<LocationRiddleState>({
		showMap: false,
		marker: null,
		submitted: false,
		mapZoom: 4,
		mapCenter: undefined,
		locationRiddle: undefined,
		loggedInUsername: '',
		achievedRating: undefined
	});

	// Selectors
	public solution = computed(() =>
		this.state().locationRiddle?.solved ? this.state().locationRiddle?.location : undefined
	);
	public guesses = computed(
		() =>
			this.state().locationRiddle?.guesses?.filter((guess) => guess.username !== this.state().loggedInUsername) ||
			[]
	);
	public userGuess = computed(
		() =>
			this.state().locationRiddle?.guesses?.find((guess) => guess.username === this.state().loggedInUsername)
				?.guess || null
	);
	public showMap = computed(() => this.state().showMap);
	public marker = computed(() => this.state().marker);
	public submitted = computed(() => this.state().submitted);
	public mapZoom = computed(() => this.state().mapZoom);
	public mapCenter = computed(() => this.state().mapCenter);
	public locationRiddle = computed(() => this.state().locationRiddle);
	public loggedInUsername = computed(() => this.state().loggedInUsername);
	public achievedRating = computed(() => this.state().achievedRating);

	// Actions
	public setLocationRiddle = new Subject<LocationRiddle>();
	public placeGuess = new Subject<Coordinate>();
	public toggleMap = new Subject<void>();
	public mapZoomChanged = new Subject<number>();
	public mapCenterChanged = new Subject<Coordinate>();
	public submitGuess = new Subject<void>();
	public commentOnLocationRiddle = new Subject<string>();
	public rateLocationRiddle = new Subject<number>();
	public deleteLocationRiddle = new Subject<string>();

	// Sources
	private commentOnLocationRiddleSource$ = this.commentOnLocationRiddle.pipe(
		switchMap((comment) =>
			this.locationRiddleApiService.postComment(this.locationRiddle()?.locationRiddleId || '', comment)
		)
	);
	private rateLocationRiddleSource$ = this.rateLocationRiddle.pipe(
		switchMap((rating) =>
			this.locationRiddleApiService.rateLocationRiddle(this.locationRiddle()?.locationRiddleId || '', rating)
		)
	);
	private deleteLocationRiddleSource$ = this.deleteLocationRiddle.pipe(
		switchMap((locationRiddleId) => this.locationRiddleApiService.deleteLocationRiddle(locationRiddleId))
	);
	private usernameSource$ = this.authService.username$;
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(() =>
			this.locationRiddleApiService.postGuess(this.locationRiddle()!.locationRiddleId, this.marker()!)
		)
	);

	constructor() {
		const locationRiddleChangeSources = merge(
			this.setLocationRiddle,
			this.commentOnLocationRiddleSource$,
			this.rateLocationRiddleSource$
		);

		connect(this.state)
			.with(this.placeGuess, (state, marker) => ({ marker }))
			.with(this.submitGuessSource, (state, guessResult) => ({
				locationRiddle: guessResult.locationRiddle,
				achievedRating: guessResult.guessResult.received_score
			}))
			.with(this.toggleMap, (state) => ({ showMap: !state.showMap }))
			.with(this.mapZoomChanged, (state, mapZoom) => ({ mapZoom }))
			.with(this.mapCenterChanged, (state, mapCenter) => ({ mapCenter }))
			.with(this.usernameSource$, (state, username) => ({ loggedInUsername: username }))
			.with(this.deleteLocationRiddleSource$, (state) => ({ locationRiddle: undefined }))
			.with(locationRiddleChangeSources, (state, locationRiddle) => ({ locationRiddle }));

		effect(() => {
			if (this.achievedRating()) {
				this.toastService.success('Congrats! You scored ' + this.achievedRating()?.toFixed(1) + ' points!');
			}
		});
	}
}
