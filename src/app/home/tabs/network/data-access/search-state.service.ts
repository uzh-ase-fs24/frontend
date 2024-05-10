import { computed, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { debounceTime, distinctUntilChanged, share, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/model/user';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';

type searchState = {
	searchTerm: string;
	searchResults: User[] | null;
	followingUsers: User[];
	loading: boolean;
};

@Injectable()
export class SearchStateService {
	// Services
	profileApiService = inject(ProfileApiService);

	// State
	private state = signal<searchState>({
		searchTerm: '',
		searchResults: [],
		followingUsers: [],
		loading: false
	});

	// Selectors
	public searchTerm = computed(() => this.state().searchTerm);
	public searchResults = computed(() => this.state().searchResults);
	public followingUsers = computed(() => this.state().followingUsers);
	public loading = computed(() => this.state().loading);

	// Action Sources (Subjects)
	public search = new Subject<string | null | undefined>();

	// Sources (Observables)
	private searchResultsSource = this.search.pipe(
		share(),
		debounceTime(500),
		distinctUntilChanged(),
		switchMap((searchTerm) => this.profileApiService.getProfilesByNamePrefix(searchTerm || ''))
	);
	private connectionsSource = this.profileApiService.getConnections();

	constructor() {
		// Reducers
		connect(this.state)
			.with(this.search, (state, searchTerm) => ({
				searchTerm: searchTerm || '',
				loading: true
			}))
			.with(this.searchResultsSource, (state, searchResults) => ({
				searchResults: searchResults,
				loading: false
			}))
			.with(this.connectionsSource, (state, connections) => ({
				followingUsers: connections.following
			}));
	}
}
