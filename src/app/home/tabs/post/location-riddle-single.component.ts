import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { LocationRiddlePostComponent } from 'src/app/shared/location-riddle-post/location-riddle-post.component';
import { switchMap } from 'rxjs';
import { IonContent, IonSpinner, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-location-riddle-single',
  standalone: true,
  imports: [
    CommonModule,
    LocationRiddlePostComponent,
    IonContent,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton
  ],
  providers: [LocationRiddleApiService],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home/feed"></ion-back-button>
        </ion-buttons>
        <ion-title>Riddle</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (locationRiddle$ | async; as locationRiddle) {
        <div class="single-post-container">
          <app-location-riddle-post [locationRiddle]="locationRiddle"></app-location-riddle-post>
        </div>
      } @else {
        <div class="spinner-container">
          <ion-spinner></ion-spinner>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .single-post-container {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
    .spinner-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LocationRiddleSingleComponent {
  private route = inject(ActivatedRoute);
  private api = inject(LocationRiddleApiService);

  // Automatically fetch the riddle whenever the route param changes
  locationRiddle$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return id ? this.api.getLocationRiddle(id) : [];
    })
  );
}
