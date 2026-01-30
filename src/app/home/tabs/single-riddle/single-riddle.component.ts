import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { catchError, EMPTY, tap } from 'rxjs';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { LocationRiddlePostComponent } from 'src/app/shared/location-riddle-post/location-riddle-post.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-single-riddle',
  templateUrl: './single-riddle.component.html',
  styleUrls: ['./single-riddle.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    LocationRiddlePostComponent
  ],
  providers: [LocationRiddleApiService, ToastService]
})
export class SingleRiddleComponent {
  // Services
  locationRiddleApiService = inject(LocationRiddleApiService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  // Get the location riddle observable - just like profile$ in ProfileComponent
  locationRiddle$ = this.locationRiddleApiService.getSingleLocationRiddle(
    this.route.snapshot.params['riddleId']
  ).pipe(
    catchError((error) => {
      this.toastService.error('Failed to load location riddle');
      return EMPTY;
    })
  );

  refresh(event?: any) {
    this.locationRiddle$ = this.locationRiddleApiService.getSingleLocationRiddle(
      this.route.snapshot.params['riddleId']
    ).pipe(
      tap(() => {
        if (event) event.target.complete();
      }),
      catchError((error) => {
        if (event) event.target.complete();
        this.toastService.error('Failed to refresh location riddle');
        return EMPTY;
      })
    );
  }
}
