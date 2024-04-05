import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthService} from '../auth/auth.service';
import {LocationRiddle, LocationRiddleDto} from "../../model/location-riddle";

@Injectable()
export class LocationRiddleApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {
  }

  getLocationRiddles(): Observable<LocationRiddle[]> {
    const mockData: LocationRiddle[] = [
      {
        locationRiddleId: 'mock_id_1',
        comments: ['mock_comments_1'],
        image: 'https://ionicframework.com/docs/img/demos/card-media.png'
      },
      {
        locationRiddleId: 'mock_id_2',
        comments: ['mock_comments_2'],
        image: 'mock_image_2'
      },
      // Add more mock data as needed
    ];

    // Use the 'of' function from RxJS to create an Observable from the mock data
    return of(mockData);

    return this.http.get<LocationRiddleDto[]>(environment.api.url + '/location-riddles').pipe(
      map((dtos: LocationRiddleDto[]) => {
        return dtos.map(dto => {
          return {
            locationRiddleId: dto.location_riddle_id,
            comments: dto.comments,
            image: dto.image
          }
        })
      })
    )
  }

}
