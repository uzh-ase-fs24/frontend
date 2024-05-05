import { computed, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { Subject, switchMap } from 'rxjs';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';

type LocationRiddleState = {
	showMap: boolean;
	marker: Coordinate | null;
	submitted: boolean;
	mapZoom: number;
	mapCenter: Coordinate | undefined;
	locationRiddle: LocationRiddle | undefined;
	username: string | undefined;
};

@Injectable()
export class LocationRiddleStateService {
	// Services
	private locationRiddleApiService = inject(LocationRiddleApiService);

	// State
	private state = signal<LocationRiddleState>({
		showMap: false,
		marker: null,
		submitted: false,
		mapZoom: 4,
		mapCenter: undefined,
		locationRiddle: undefined,
		username: ''
	});

	// Selectors
	public solution = computed(() =>
		this.state().locationRiddle?.solved ? this.state().locationRiddle?.location : undefined
	);
	public guesses = computed(
		() => this.state().locationRiddle?.guesses?.filter((guess) => guess.username !== this.state().username) || []
	);
	public userGuess = computed(
		() =>
			this.state().locationRiddle?.guesses?.find((guess) => guess.username === this.state().username)?.guess ||
			null
	);
	public showMap = computed(() => this.state().showMap);
	public marker = computed(() => this.state().marker);
	public submitted = computed(() => this.state().submitted);
	public mapZoom = computed(() => this.state().mapZoom);
	public mapCenter = computed(() => this.state().mapCenter);
	public locationRiddle = computed(() => this.state().locationRiddle);
	public username = computed(() => this.state().username);

	// Actions
	public setUsername = new Subject<string | undefined>();
	public setLocationRiddle = new Subject<LocationRiddle>();
	public placeGuess = new Subject<Coordinate>();
	public toggleMap = new Subject<void>();
	public mapZoomChanged = new Subject<number>();
	public mapCenterChanged = new Subject<Coordinate>();
	public submittedGuess = new Subject<void>();
	public commentOnLocationRiddle = new Subject<string>();

	// Sources
	private commentOnLocationRiddleSource$ = this.commentOnLocationRiddle.pipe(
		switchMap((comment) =>
			this.locationRiddleApiService.postComment(this.locationRiddle()?.locationRiddleId || '', comment)
		)
	);

	constructor() {
		connect(this.state)
			.with(this.placeGuess, (state, marker) => ({ marker }))
			.with(this.submittedGuess, (state) => ({ submitted: true }))
			.with(this.toggleMap, (state) => ({ showMap: !state.showMap }))
			.with(this.mapZoomChanged, (state, mapZoom) => ({ mapZoom }))
			.with(this.mapCenterChanged, (state, mapCenter) => ({ mapCenter }))
			.with(this.setUsername, (state, username) => ({ username }))
			.with(this.setLocationRiddle, (state, locationRiddle) => ({ locationRiddle }))
			.with(this.commentOnLocationRiddleSource$, (state, updatedLocationRiddle) => ({
				locationRiddle: updatedLocationRiddle
			}));
	}
}
