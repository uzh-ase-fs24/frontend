import {CommonModule} from '@angular/common';
import {Component, input} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-location-riddle-post',
  templateUrl: './location-riddle-post.component.html',
  imports: [
    IonImg,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonCard,
    IonAvatar,
    IonItem,
    IonLabel,
    CommonModule
  ],
  styleUrls: ['./location-riddle-post.component.scss'],
  standalone: true
})
export class LocationRiddlePostComponent {
  username = input<string>();
  locationRiddleImage = input<string>();
  comments = input<string[]>();
  createdAt = input<number>();

  constructor() {
  }

}
