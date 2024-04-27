import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { User, UserConnections, UserConnectionsDto, UserDto, UserForm, UserFormDto } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileApiService {
	http = inject(HttpClient);
	auth = inject(AuthService);

	constructor() {}

	getProfile(username?: string): Observable<User> {
		return this.http
			.get<UserDto>(environment.api.url + '/users' + (username ? `/${username}` : ''))
			.pipe(map((dto) => this.mapDtoToUser(dto)));
	}

	getProfilesByNamePrefix(prefix: string): Observable<User[]> {
		if (!prefix) {
			return of([]);
		}
		return this.http
			.get<UserDto[]>(environment.api.url + '/users/search', {
				params: { username: prefix }
			})
			.pipe(
				map((users) => {
					return users.map((user) => this.mapDtoToUser(user));
				})
			);
	}

	postProfile(user: UserFormDto): Observable<User> {
		return this.http.post<UserDto>(environment.api.url + '/users', user).pipe(map((dto) => this.mapDtoToUser(dto)));
	}

	updateProfile(user: UserForm): Observable<User> {
		return this.http
			.put<UserDto>(environment.api.url + '/users', {
				first_name: user.firstName,
				last_name: user.lastName,
				bio: user.bio
			})
			.pipe(map((dto) => this.mapDtoToUser(dto)));
	}

	getConnections(username?: string): Observable<UserConnections> {
		return this.auth.user$.pipe(
			switchMap((profile) => {
				const user = username || profile?.['https://findme.ch/username'];
				return this.http.get<UserConnectionsDto>(environment.api.url + `/users/${user}/follow`).pipe(
					map((dto) => {
						return {
							following: dto.following.map((userDto) => this.mapDtoToUser(userDto)),
							followers: dto.followers.map((userDto) => this.mapDtoToUser(userDto))
						};
					})
				);
			})
		);
	}

	private mapDtoToUser(dto: UserDto): User {
		return {
			username: dto.username,
			firstName: dto.first_name,
			lastName: dto.last_name,
			bio: dto.bio,
			averageScore: dto.average_score
		};
	}
}
