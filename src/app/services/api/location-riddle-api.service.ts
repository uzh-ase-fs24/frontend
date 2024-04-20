import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationRiddle, LocationRiddleDto, LocationRiddlePostDto } from '../../model/location-riddle';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocationRiddleApiService {
	http = inject(HttpClient);
	auth = inject(AuthService);

	constructor() {}

	getLocationRiddles(): Observable<LocationRiddle[]> {
		return this.http.get<LocationRiddleDto[]>(environment.api.url + '/location-riddles').pipe(
			map((dtos: LocationRiddleDto[]) => {
				return dtos.map((dto) => this.mapDtoToLocationRiddle(dto));
			})
		);
	}

	postLocationRiddle(locationRiddle: LocationRiddlePostDto): Observable<void> {
		return this.http.post<void>(environment.api.url + '/location-riddles', locationRiddle);
	}

	rateLocationRiddle(locationRiddleId: string, rating: number): Observable<LocationRiddle> {
		return this.http
			.patch<LocationRiddleDto>(environment.api.url + '/location-riddles/' + locationRiddleId + '/rate', {
				rating: rating
			})
			.pipe(map((dto) => this.mapDtoToLocationRiddle(dto)));
	}

	private mapDtoToLocationRiddle(dto: LocationRiddleDto): LocationRiddle {
		return {
			locationRiddleId: dto.location_riddle_id,
			userId: dto.user_id,
			comments: dto.comments,
			locationRiddleImage: dto.location_riddle_image.image_base64,
			createdAt: dto.created_at,
			rating: dto.average_rating
		};
	}
}
