import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LocationRiddle, LocationRiddleDto, LocationRiddlePostDto } from '../../model/location-riddle';
import { environment } from '../../../environments/environment';

@Injectable()
export class LocationRiddleApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);

  constructor() {}

  getLocationRiddles(): Observable<LocationRiddle[]> {
    return this.http
      .get<LocationRiddleDto[]>(environment.api.url + '/location-riddles')
      .pipe(
        map((dtos: LocationRiddleDto[]) => {
          return dtos.map((dto) => {
            return {
              locationRiddleId: dto.location_riddle_id,
              userId: dto.user_id,
              comments: dto.comments,
              locationRiddleImage: dto.location_riddle_image.image_base64,
              createdAt: dto.created_at,
              rating: dto.rating,
            };
          });
        })
      );
  }

  postLocationRiddle(locationRiddle: LocationRiddlePostDto): Observable<void> {
    return this.http.post<void>(environment.api.url + '/location-riddles', locationRiddle);
  }
}
