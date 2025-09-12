import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);

	// Skip authentication for requests that include a username in the body (public guest requests)
	if (req.body && typeof req.body === 'object' && 'username' in req.body &&
		typeof req.body.username === 'string' && req.body.username.startsWith('guest_')) {
		return next(req);
	}

	return authService.acquireTokenSilently().pipe(
		switchMap((token) => {
			const authReq = req.clone({
				headers: req.headers.set('Authorization', `Bearer ${token}`)
			});
			return next(authReq);
		})
	);
};
