import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import {of, share, Subject, switchMap, tap } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';

type FeedState = {
	locationRiddles: LocationRiddle[];
	username: string;
  arena: string;
	riddlesLoading: boolean;
};

type RateEvent = { locationRiddleId: string; rating: number };

@Injectable()
export class FeedStateService {
	// Services
	locationRiddleApiService = inject(LocationRiddleApiService);
	authService = inject(AuthService);

	// State
	private state = signal<FeedState>({
		locationRiddles: [],
		username: '',
    arena: '',
		riddlesLoading: true
	});

	// Selectors
	public username = computed(() => this.state().username);
	public locationRiddles = computed(() => this.state().locationRiddles);
	public loading = computed(() => this.state().riddlesLoading || !this.username());
  public arena = computed(() => this.state().arena);

	// Action Sources (Subjects)
	public refresh = new Subject<void>();
	public submitGuess = new Subject<{ locationRiddleId: string; guess: Coordinate }>();
	public commentOnLocationRiddle = new Subject<{ locationRiddleId: string; comment: string }>();
	public rateLocationRiddle = new Subject<RateEvent>();
  public setArena = new Subject<string>();

	// Sources (Observables)
	private userSource$ = this.authService.user$;
  private locationRiddlesSource$ = this.setArena.pipe(
    startWith(this.state().arena),
    tap(() => this.state().riddlesLoading = true ),
    switchMap(arena => this.locationRiddleApiService.getLocationRiddles(arena)),
    share()
  );
	private refreshLocationRiddlesSource$ = this.refresh.pipe(switchMap(() => this.locationRiddlesSource$));
	private submitGuessSource = this.submitGuess.pipe(
		switchMap(({ locationRiddleId, guess }) => this.locationRiddleApiService.postGuess(locationRiddleId, guess))
	);
	private commentOnLocationRiddleSource$ = this.commentOnLocationRiddle.pipe(
		switchMap(({ locationRiddleId, comment }) =>
			this.locationRiddleApiService.postComment(locationRiddleId, comment)
		)
	);
	private rateLocationRiddleSource$ = this.rateLocationRiddle.pipe(
		switchMap((event) => this.locationRiddleApiService.rateLocationRiddle(event.locationRiddleId, event.rating))
	);

	constructor() {
		// Reducers
		connect(this.state)
			.with(this.userSource$, (state, user) => ({
				username: user?.[environment.auth.namespace + '/username'] || ''
			}))
			.with(this.locationRiddlesSource$, (state, locationRiddles) => ({
				locationRiddles: locationRiddles,
				riddlesLoading: false
			}))
      .with(this.setArena, (state, arena) => ({
        arena: arena
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
			.with(this.commentOnLocationRiddleSource$, (state, updatedLocationRiddle) => ({
				locationRiddles: state.locationRiddles.map((riddle) =>
					riddle.locationRiddleId === updatedLocationRiddle.locationRiddleId ? updatedLocationRiddle : riddle
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
