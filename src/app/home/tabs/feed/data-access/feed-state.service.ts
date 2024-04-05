import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {Subject, switchMap} from 'rxjs';
import {User} from 'src/app/model/user';
import {connect} from 'ngxtension/connect';
import {LocationRiddle} from "../../../../model/location-riddle";
import {LocationRiddleApiService} from "../../../../services/api/location-riddle-api.service";

type FeedState = {
  locationRiddles: LocationRiddle[];
  user?: User;
};

@Injectable()
export class FeedStateService {
  // Services
  locationRiddleApiService = inject(LocationRiddleApiService);
  // Action Sources (Subjects)
  public loadRiddles = new Subject<null | undefined>();
  // State
  private state = signal<FeedState>({
    locationRiddles: [],
    user: undefined,
  });
  // Selectors
  public locationRiddles = computed(() => this.state().locationRiddles);
  // Sources (Observables)
  private locationRiddlesSource = this.loadRiddles.pipe(
    switchMap(() =>
      this.locationRiddleApiService.getLocationRiddles()
    )
  );

  constructor() {
    // Reducers
    connect(this.state)
      .with(this.locationRiddlesSource, (state, locationRiddles) => ({
        locationRiddles: locationRiddles,
      }));

    effect(() => console.log(this.state()));
  }
}
