import { computed, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Coordinate } from 'ol/coordinate';
import { merge, Subject, switchMap, tap } from 'rxjs';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';

type PostState = {
	image: string | null;
	location: Coordinate | null;
};

@Injectable({
	providedIn: 'root'
})
export class PostStateService {
	// Services
	private locationRiddleApi = inject(LocationRiddleApiService);

	// State
	private state = signal<PostState>({
		image: null,
		location: null
	});

	// Selectors
	imageSet = computed(() => !!this.state().image);
	locationSet = computed(() => !!this.state().location);

	// Action Sources (Subjects)
	uploadImage = new Subject<string>();
	cancelPost = new Subject<void>();
	setLocation = new Subject<Coordinate>();
	completePost = new Subject<void>();

	// Sources (Observables)
	postLocationRiddle = this.completePost.pipe(
		tap(() => console.log(this.state().image?.split('base64,'))),
		switchMap(() =>
			this.locationRiddleApi.postLocationRiddle({
				location: this.state().location!,
				// ensure the base64 prefix is not included
				image: this.state().image?.split('base64,')[1] || this.state().image!
			})
		)
	);

	constructor() {
		connect(this.state)
			.with(this.uploadImage, (state, image) => {
				return { ...state, image };
			})
			.with(this.setLocation, (state, location) => {
				return { ...state, location };
			})
			.with(merge(this.cancelPost, this.postLocationRiddle), (state) => {
				return { image: null, location: null };
			});
	}
}
