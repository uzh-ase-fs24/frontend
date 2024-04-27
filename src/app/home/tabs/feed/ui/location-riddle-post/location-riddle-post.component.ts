import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, ViewChild } from '@angular/core';
import {
	IonAvatar,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonFab,
	IonFabButton,
	IonIcon,
	IonImg,
	IonItem,
	IonLabel
} from '@ionic/angular/standalone';
import { Coordinate } from 'ol/coordinate';
import { Guess, LocationRiddle } from 'src/app/model/location-riddle';
import { MapComponent } from '../../../../../shared/map/map.component';
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
		IonItem,
		IonLabel,
		CommonModule,
		MapComponent,
		RatingComponent
	],
	styleUrls: ['./location-riddle-post.component.scss'],
	standalone: true
})
export class LocationRiddlePostComponent {
	locationRiddle = input.required<LocationRiddle>();
	username = input<string>();

	submitGuess = output<Coordinate>();

	rateRiddle = output<number>();

	@ViewChild(MapComponent) mapComponent!: MapComponent;

	showMap = signal(false);
	marker = signal<Coordinate | null>(null);
	submitted = signal(false);
	solution = computed(() => this.locationRiddle().solved ? this.locationRiddle().location : undefined);
	guesses = computed(() => this.locationRiddle().guesses?.filter((guess) => guess.username !== this.username()) || []);
	userGuess = computed(() => this.locationRiddle().guesses?.find((guess) => guess.username === this.username())?.guess || null);

	constructor() {}

	toggleMap() {
		this.showMap.set(!this.showMap());
	}

	placeGuess(guess: Coordinate) {
		this.marker.set(guess);
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
