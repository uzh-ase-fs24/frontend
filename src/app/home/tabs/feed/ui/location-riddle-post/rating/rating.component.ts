import {CommonModule} from '@angular/common';
import {Component, effect, input} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  imports: [
    IonImg,
    IonChip,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonCard,
    IonAvatar,
    IonItem,
    IonLabel,
    CommonModule,
  ],
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
    })
  }

  getStars(): number[] {
    return Array.from({length: this.rating()}, (_, i) => i);
  }

  getEmptyStars(): number[] {
    return Array.from({length: 5 - this.rating()}, (_, i) => i);
  }

  getHalfStar(): boolean {
    return this.rating() % 1 !== 0;
  }


}
