import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
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
import { LocationRiddle } from 'src/app/model/location-riddle';
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

	submitGuess = output<Coordinate>();

	rateRiddle = output<number>();

	showMap = signal(false);
	guess = signal<Coordinate | null>(null);
	submitted = signal(false);

	constructor() {}

	toggleMap() {
		this.showMap.set(!this.showMap());
	}

	placeGuess(guess: Coordinate) {
		this.guess.set(guess);
	}

	submit() {
		if (this.guess()) {
			// The flow prevents the guess from being null, but for the sake of typing we define a fallback
			this.submitGuess.emit(this.guess() || []);
			this.submitted.set(true);
		}
	}

	get solution() {
		return this.locationRiddle().solved ? this.locationRiddle().location : undefined;
	}

	// get filteredUserGuesses() {
	// 	return this.locationRiddle()?.guesses.filter((guess) => guess.userId !== this.locationRiddle());
	// }

	// get userGuess() {
	// 	return this.locationRiddle().guesses.find((guess) => guess.userId === this.locationRiddle().userId)?.guess;
	// }
}
