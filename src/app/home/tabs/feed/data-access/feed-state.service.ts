import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { share, Subject, switchMap, tap } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';
import { ToastService } from '../../../../services/toast.service';

type FeedState = {
	locationRiddles: LocationRiddle[];
	username: string;
	arena: string;
	riddlesLoading: boolean;
};

@Injectable()
export class FeedStateService {
	// Services
	locationRiddleApiService = inject(LocationRiddleApiService);
	authService = inject(AuthService);
	toastService = inject(ToastService);

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
	public setArena = new Subject<string>();

	// Sources (Observables)
	private userSource$ = this.authService.user$;
	private locationRiddlesSource$ = this.setArena.pipe(
		startWith(this.state().arena),
		tap(() => (this.state().riddlesLoading = true)),
		switchMap((arena) => this.locationRiddleApiService.getLocationRiddles(arena)),
		share()
	);
	private refreshLocationRiddlesSource$ = this.refresh.pipe(switchMap(() => this.locationRiddlesSource$));

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
			}));

		effect(() => console.info('Feed State Change: ', this.state()));
	}
}
