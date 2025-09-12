import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { Subject, switchMap } from 'rxjs';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { GuestUserService } from 'src/app/services/guest-user.service';
import { ToastService } from 'src/app/services/toast.service';

type PublicLocationRiddleState = {
	showMap: boolean;
	marker: Coordinate | null;
	submitted: boolean;
	mapZoom: number;
	mapCenter: Coordinate | undefined;
	locationRiddle: LocationRiddle | undefined;
	guestUsername: string;
	achievedRating: number | undefined;
};

@Injectable()
export class PublicLocationRiddleStateService {
	// Services
	private locationRiddleApiService = inject(LocationRiddleApiService);
	private guestUserService = inject(GuestUserService);
	private toastService = inject(ToastService);

	// State
	private state = signal<PublicLocationRiddleState>({
		showMap: false,
		marker: null,
		submitted: false,
		mapZoom: 4,
		mapCenter: undefined,
		locationRiddle: undefined,
		guestUsername: '',
		achievedRating: undefined
	});

	// Selectors
	public solution = computed(() =>
		this.state().locationRiddle?.solved ? this.state().locationRiddle?.location : undefined
	);
	public guesses = computed(
		() =>
			this.state().locationRiddle?.guesses?.filter((guess) => guess.username !== this.state().guestUsername) ||
			[]
	);
	public userGuess = computed(
		() =>
			this.state().locationRiddle?.guesses?.find((guess) => guess.username === this.state().guestUsername)
				?.guess || null
	);
	public showMap = computed(() => this.state().showMap);
	public marker = computed(() => this.state().marker);
	public submitted = computed(() => this.state().submitted);
	public mapZoom = computed(() => this.state().mapZoom);
	public mapCenter = computed(() => this.state().mapCenter);
	public locationRiddle = computed(() => this.state().locationRiddle);
	public guestUsername = computed(() => this.state().guestUsername);
	public achievedRating = computed(() => this.state().achievedRating);

	// Actions
	public setLocationRiddle = new Subject<LocationRiddle>();
	public placeGuess = new Subject<Coordinate>();
	public toggleMap = new Subject<void>();
	public mapZoomChanged = new Subject<number>();
	public mapCenterChanged = new Subject<Coordinate>();
	public submitGuess = new Subject<void>();

	// Sources
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(() =>
			this.locationRiddleApiService.postPublicGuess(this.locationRiddle()!.locationRiddleId, this.marker()!)
		)
	);

	constructor() {
		// Initialize guest username
		const guestUsername = this.guestUserService.initializeGuestUser();
		this.state.update(state => ({ ...state, guestUsername }));

		connect(this.state)
			.with(this.placeGuess, (state, marker) => ({ marker }))
			.with(this.submitGuessSource, (state, guessResult) => ({
				locationRiddle: guessResult.locationRiddle,
				achievedRating: guessResult.guessResult.received_score
			}))
			.with(this.toggleMap, (state) => ({ showMap: !state.showMap }))
			.with(this.mapZoomChanged, (state, mapZoom) => ({ mapZoom }))
			.with(this.mapCenterChanged, (state, mapCenter) => ({ mapCenter }))
			.with(this.setLocationRiddle, (state, locationRiddle) => ({ locationRiddle }));

		effect(() => {
			if (this.achievedRating()) {
				this.toastService.success('Congrats! You scored ' + this.achievedRating()?.toFixed(1) + ' points!');
			}
		});
	}
}
