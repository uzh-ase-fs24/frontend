import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal, ViewChild } from '@angular/core';
import {
	IonAvatar,
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonFab,
	IonFabButton,
	IonIcon,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonModal
} from '@ionic/angular/standalone';
import { Coordinate } from 'ol/coordinate';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { MapComponent } from 'src/app/shared/map/map.component';
import { RatingComponent } from './rating/rating.component';

@Component({
	selector: 'app-location-riddle-post',
	templateUrl: './location-riddle-post.component.html',
	imports: [
		IonImg,
		IonIcon,
		IonFab,
		IonFabButton,
		IonCardContent,
		IonCardTitle,
		IonCardHeader,
		IonCard,
		IonAvatar,
		IonModal,
		IonContent,
		IonInput,
		IonItem,
		IonLabel,
		IonButton,
		CommonModule,
		MapComponent,
		RatingComponent
	],
	styleUrls: ['./location-riddle-post.component.scss'],
	standalone: true
})
export class LocationRiddlePostComponent {
	@ViewChild(MapComponent) mapComponent!: MapComponent;

	locationRiddle = input.required<LocationRiddle>();
	username = input<string>();

	submitGuess = output<Coordinate>();
	commentLocationRiddle = output<string>();
	rateLocationRiddle = output<number>();

	showMap = signal(false);
	marker = signal<Coordinate | null>(null);
	submitted = signal(false);
	mapZoom = signal(4);
	mapCenter = signal<Coordinate | undefined>(undefined);
	solution = computed(() => (this.locationRiddle().solved ? this.locationRiddle().location : undefined));
	guesses = computed(
		() => this.locationRiddle().guesses?.filter((guess) => guess.username !== this.username()) || []
	);
	userGuess = computed(
		() => this.locationRiddle().guesses?.find((guess) => guess.username === this.username())?.guess || null
	);

	constructor() {
		effect(() => {
			console.log(this.mapCenter());
		});
	}

	toggleMap() {
		this.showMap.set(!this.showMap());
	}

	placeGuess(guess: Coordinate) {
		this.marker.set(guess);
	}

	comment(commentInputRef: IonInput) {
		if (commentInputRef.value) {
			this.commentLocationRiddle.emit(commentInputRef.value.toString());
			commentInputRef.value = '';
		}
	}

	submit() {
		if (this.marker()) {
			// The flow prevents the guess from being null, but for the sake of typing we define a fallback
			this.submitGuess.emit(this.marker() || []);
			this.submitted.set(true);
			this.mapComponent.refreshMap();
		}
	}
}
