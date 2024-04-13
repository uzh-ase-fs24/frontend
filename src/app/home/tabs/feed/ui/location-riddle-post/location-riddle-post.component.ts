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
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import {MapComponent} from "./map/map.component";
import {Coordinate} from 'ol/coordinate';

@Component({
  selector: 'app-location-riddle-post',
  templateUrl: './location-riddle-post.component.html',
  imports: [
    IonImg,
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
    MapComponent,
  ],
  styleUrls: ['./location-riddle-post.component.scss'],
  standalone: true
})
export class LocationRiddlePostComponent {
  username = input<string>();
  locationRiddleImage = input<string>();
  comments = input<string[]>();
  createdAt = input<number>();

  showMap: boolean = false;
  guessedLocation?: Coordinate;

  constructor() {
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  submitGuess() {
    console.log(this.guessedLocation)
  }

}
