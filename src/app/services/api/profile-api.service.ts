import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User, UserDto, UserForm, UserFormDto } from 'src/app/model/user';
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
		return this.http.post<UserDto>(environment.api.url + '/users', user).pipe(
			map((user) => {
				return {
					username: user.username,
					firstName: user.first_name,
					lastName: user.last_name,
					bio: user.bio
				};
			})
		);
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

	private mapDtoToUser(dto: UserDto): User {
		return {
			username: dto.username,
			firstName: dto.first_name,
			lastName: dto.last_name,
			bio: dto.bio
		};
	}
}
