import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationRiddle, LocationRiddleDto, GuessResult, guessResultDto } from '../../model/location-riddle';

@Injectable({
	providedIn: 'root'
})
export class PublicLocationRiddleService {
	private http = inject(HttpClient);
	private readonly ANONYMOUS_USERNAME_KEY = 'anonymous_username';

	getAnonymousUsername(): string {
		let username = localStorage.getItem(this.ANONYMOUS_USERNAME_KEY);
		if (!username) {
			username = this.generateAnonymousUsername();
			localStorage.setItem(this.ANONYMOUS_USERNAME_KEY, username);
		}
		return username;
	}

	private generateAnonymousUsername(): string {
		const adjectives = ['Quick', 'Silent', 'Brave', 'Swift', 'Sharp', 'Clever', 'Bold', 'Wise'];
		const animals = ['Eagle', 'Wolf', 'Fox', 'Tiger', 'Bear', 'Hawk', 'Lion', 'Owl'];
		const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
		const randomNumber = Math.floor(Math.random() * 1000);
		return `${randomAdjective}${randomAnimal}${randomNumber}`;
	}

	getPublicLocationRiddle(locationRiddleId: string): Observable<LocationRiddle> {
		const username = this.getAnonymousUsername();
		return this.http
			.post<LocationRiddleDto>(`${environment.api.url}/public/location-riddles/${locationRiddleId}`, {
				username: username
			})
			.pipe(map((dto: LocationRiddleDto) => this.mapDtoToLocationRiddle(dto)));
	}

	postPublicGuess(locationRiddleId: string, guess: Coordinate): Observable<GuessResult> {
		const username = this.getAnonymousUsername();
		return this.http
			.post<guessResultDto>(`${environment.api.url}/public/location-riddles/${locationRiddleId}/guess`, {
				username: username,
				guess: guess
			})
			.pipe(
				map((dto) => ({
					locationRiddle: this.mapDtoToLocationRiddle(dto.location_riddle),
					guessResult: {
						distance: dto.guess_result.distance,
						received_score: dto.guess_result.received_score
					}
				}))
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
			rated: dto.is_rated_by_user,
			guesses: dto.guesses?.map((guess) => ({
				guess: guess.guess.coordinate,
				username: guess.username
			}))
		};
	}
}
