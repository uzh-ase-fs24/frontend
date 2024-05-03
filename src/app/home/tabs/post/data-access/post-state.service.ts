import { computed, inject, Injectable, signal } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { from, merge, Subject, switchMap, tap } from 'rxjs';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';

type PostState = {
	image: string | undefined;
	location: Coordinate | undefined;
  arenas: string[] | undefined;
};

@Injectable({
	providedIn: 'root'
})
export class PostStateService {
	// Services
	private locationRiddleApi = inject(LocationRiddleApiService);

	// State
	private state = signal<PostState>({
		image: undefined,
		location: undefined,
    arenas: undefined
	});

	// Selectors
	imageSet = computed(() => !!this.state().image);
	locationSet = computed(() => !!this.state().location);
  arenasSet = computed(() => !!this.state().arenas);
	location = computed(() => this.state().location);

	// Action Sources (Subjects)
	uploadImage = new Subject<string>();
	cancelPost = new Subject<void>();
	setLocation = new Subject<Coordinate>();
  setArenas = new Subject<string[]>();
	completePost = new Subject<void>();

	// Sources (Observables)
	postLocationRiddle = this.completePost.pipe(
		tap(() => console.log(this.state().image?.split('base64,'))),
		switchMap(() =>
			this.locationRiddleApi.postLocationRiddle({
				location: this.state().location!,
				// ensure the base64 prefix is not included
				image: this.state().image?.split('base64,')[1] || this.state().image!,
        arenas: this.state().arenas!
			})
		)
	);

	userLocation = from(Geolocation.getCurrentPosition());

	constructor() {
		connect(this.state)
			.with(this.uploadImage, (state, image) => ({ image }))
			.with(this.setLocation, (state, location) => ({ location }))
      .with(this.setArenas, (state, arenas) => ({ arenas }))
			.with(this.userLocation, (state, location) => {
				const { latitude, longitude } = location.coords;
				const olCoordinates = fromLonLat([longitude, latitude]);
				console.log('User location:', location, olCoordinates);
				return { location: olCoordinates };
			})
			.with(merge(this.cancelPost, this.postLocationRiddle), (state) => ({
				image: undefined,
				location: undefined,
        arenas: undefined
			}));
	}
}
