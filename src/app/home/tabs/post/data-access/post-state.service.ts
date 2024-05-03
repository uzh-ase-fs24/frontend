import { computed, inject, Injectable, signal } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { filter, from, merge, Subject, switchMap } from 'rxjs';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';

type PostState = {
	image: string | undefined;
	location: Coordinate | undefined;
	userLocation: Coordinate | undefined;
	uploading: boolean;
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
		userLocation: undefined,
		uploading: false
	});

	// Selectors
	imageSet = computed(() => !!this.state().image);
	postingEnabled = computed(() => !!this.state().location && !this.state().uploading);
	location = computed(() => this.state().location);

	// Action Sources (Subjects)
	uploadImage = new Subject<string>();
	cancelPost = new Subject<void>();
	setLocation = new Subject<Coordinate>();
	completePost = new Subject<void>();

	// Sources (Observables)
	postLocationRiddle = this.completePost.pipe(
		filter(() => this.postingEnabled()),
		switchMap(() =>
			this.locationRiddleApi.postLocationRiddle({
				location: this.state().location!,
				// ensure the base64 prefix is not included
				image: this.state().image?.split('base64,')[1] || this.state().image!
			})
		)
	);

	userLocation = from(Geolocation.getCurrentPosition());

	constructor() {
		connect(this.state)
			.with(this.uploadImage, (state, image) => ({ image }))
			.with(this.setLocation, (state, location) => ({ location }))
			.with(this.userLocation, (state, location) => {
				const { latitude, longitude } = location.coords;
				const olCoordinates = fromLonLat([longitude, latitude]);
				return { location: olCoordinates, userLocation: olCoordinates };
			})
			.with(this.postLocationRiddle, (state) => ({ uploading: true }))
			.with(merge(this.cancelPost, this.postLocationRiddle), (state) => ({
				image: undefined,
				location: state.userLocation
			}));
	}
}
