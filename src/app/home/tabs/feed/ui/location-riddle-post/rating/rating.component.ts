import { Component, effect, input } from '@angular/core';
import { IonChip, IonIcon } from '@ionic/angular/standalone';

@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	imports: [IonChip, IonIcon],
	styleUrls: ['./rating.component.scss'],
	standalone: true
})
export class RatingComponent {
	rating = input.required<number>();

	constructor() {
		effect(() => {
			if (this.rating() < 0 || this.rating() > 5) {
				throw new Error('RatingComponent rating input must be between 0 and 5');
			}
		});
	}

	getStars(): number[] {
		return Array.from({ length: this.rating() }, (_, i) => i);
	}

	getEmptyStars(): number[] {
		// Only 4 empty stars are needed since a half star is displayed separately -> half star is empty if rating is an integer
		return Array.from({ length: 4 - this.rating() }, (_, i) => i);
	}

	getHalfStar(): boolean {
		return this.rating() % 1 !== 0;
	}
}
