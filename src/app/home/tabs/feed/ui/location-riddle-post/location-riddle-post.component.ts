import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal
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
    IonModal,
    IonContent,
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
}
