import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/model/user';
import { connect } from 'ngxtension/connect';
import { LocationRiddle } from '../../../../model/location-riddle';
import { LocationRiddleApiService } from '../../../../services/api/location-riddle-api.service';
import { ProfileApiService } from '../../../../services/api/profile-api.service';

type FeedState = {
  locationRiddles: LocationRiddle[];
  users: User[];
  loading: boolean;
};

@Injectable()
export class FeedStateService {
  // Services
  locationRiddleApiService = inject(LocationRiddleApiService);
  profileApiService = inject(ProfileApiService);

  // State
  private state = signal<FeedState>({
    locationRiddles: [],
    users: [],
    loading: true,
  });

  // Selectors
  public locationRiddles = computed(() => this.state().locationRiddles);
  public users = computed(() => this.state().users);
  public loading = computed(() => this.state().loading);

  // Action Sources (Subjects)
  public refresh = new Subject<void>();

  // Sources (Observables)
  private locationRiddlesSource =
    this.locationRiddleApiService.getLocationRiddles();
  private usersSource = this.locationRiddleApiService.getLocationRiddles().pipe(
    map((locationRiddles) =>
      forkJoin(
        locationRiddles.map((locationRiddle) =>
          this.profileApiService.getProfile(locationRiddle.userId || '')
        )
      )
    ),
    switchMap((users) => users)
  );
  private refreshLocationRiddlesSource = this.refresh.pipe(
    switchMap(() => this.locationRiddlesSource)
  );
  private refreshUsersSource = this.refresh.pipe(
    switchMap(() => this.usersSource)
  );

  constructor() {
    // Reducers
    connect(this.state)
      .with(this.locationRiddlesSource, (state, locationRiddles) => ({
        locationRiddles: locationRiddles,
        loading: false,
      }))
      .with(this.usersSource, (state, users) => ({
        users: users,
      }))
      .with(this.refreshLocationRiddlesSource, (state, locationRiddles) => ({
        locationRiddles: locationRiddles,
      }))
      .with(this.refreshUsersSource, (state, users) => ({
        users: users,
      }));

    effect(() => console.info('Feed State Change: ', this.state()));
  }
}
