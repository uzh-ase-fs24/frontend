import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { catchError } from 'rxjs/operators';
import { of, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	GuessResult,
	guessResultDto,
	LocationRiddle,
	LocationRiddleDto,
	LocationRiddlePostDto
} from '../../model/location-riddle';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocationRiddleApiService {
	http = inject(HttpClient);
	auth = inject(AuthService);

	constructor() {}

	getLocationRiddles(arena?: string): Observable<LocationRiddle[]> {
		return this.getRequest('/location-riddles' + (arena ? `/arena/${arena}` : ''));
	}

  getUserLocationRiddles(): Observable<LocationRiddle[]> {
		return this.getRequest('/location-riddles/user');
	}

	postLocationRiddle(locationRiddle: LocationRiddlePostDto): Observable<void> {
		return this.http.post<void>(environment.api.url + '/location-riddles', locationRiddle);
	}

	postGuess(locationRiddleId: string, guess: Coordinate): Observable<GuessResult> {
		return this.http
			.post<guessResultDto>(environment.api.url + '/location-riddles/' + locationRiddleId + '/guess', {
				guess: guess
			})
			.pipe(
				map((dto) => ({
					locationRiddle: this.mapDtoToLocationRiddle(dto.location_riddle),
					guessResult: {
						distance: dto.guess_result.distance,
						score: dto.guess_result.score
					}
				}))
			);
	}

	postComment(locationRiddleId: string, comment: string): Observable<LocationRiddle> {
		return this.http
			.post<LocationRiddleDto>(environment.api.url + '/location-riddles/' + locationRiddleId + '/comment', {
				comment: comment
			})
			.pipe(map((dto: LocationRiddleDto) => this.mapDtoToLocationRiddle(dto)));
	}

	rateLocationRiddle(locationRiddleId: string, rating: number): Observable<LocationRiddle> {
		return this.http
			.post<LocationRiddleDto>(environment.api.url + '/location-riddles/' + locationRiddleId + '/rate', {
				rating: rating
			})
			.pipe(map((dto) => this.mapDtoToLocationRiddle(dto)));
	}

	private getRequest(url: string): Observable<LocationRiddle[]> {
		return this.http.get<LocationRiddleDto[]>(environment.api.url + url).pipe(
			map((dtos: LocationRiddleDto[]) => {
				return dtos.map((dto) => this.mapDtoToLocationRiddle(dto));
			}),
      catchError((error) => {
        return of([]);
      })
		);
	}

	private mapDtoToLocationRiddle(dto: LocationRiddleDto): LocationRiddle {
		return {
			solved: dto.solved,
			locationRiddleId: dto.location_riddle_id,
			username: dto.username,
			comments: dto.comments,
			locationRiddleImage: dto.image_base64,
			createdAt: dto.created_at * 1000,
			rating: dto.average_rating,
			location: dto.location?.coordinate,
			guesses: dto.guesses?.map((guess) => ({
				guess: guess.guess.coordinate,
				username: guess.username
			}))
		};
	}
}
