import {Component, input, OnInit} from '@angular/core';
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
    IonLabel
  ],
  styleUrls: ['./location-riddle-post.component.scss'],
  standalone: true
})
export class LocationRiddlePostComponent implements OnInit {
  locationRiddleImage = input<string>();
  comments = input<string[]>();

  constructor() {
  }

  ngOnInit() {
  }

}
