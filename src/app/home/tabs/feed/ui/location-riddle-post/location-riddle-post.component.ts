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
	username = input<string>();
	locationRiddleImage = input<string>();
	comments = input<string[]>();
	rating = input<number>();
	createdAt = input<number>();

	rateRiddle = output<number>();

	showMap = signal(false);
	guessedLocation?: Coordinate;
	imageHeight = signal(null);

	constructor() {}

	toggleMap() {
		this.showMap.set(!this.showMap());
	}

	submitGuess() {
		console.log(this.guessedLocation);
	}
}
