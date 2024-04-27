import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User, AuthService as auth0 } from '@auth0/auth0-angular';
import { Browser } from '@capacitor/browser';
import { isPlatform } from '@ionic/angular';
import config from 'capacitor.config';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private auth0 = inject(auth0);

	// A central subject is needed to signal when the user has signedup
	// -> prevents an infinite pulling of the user profile during the signup process
	public userProfileReady = new ReplaySubject<void>();

	constructor() {}

	public static readonly redirectCallback = isPlatform('hybrid')
		? `${config.appId}://${environment.auth.domain}/capacitor/${config.appId}/callback`
		: environment.auth.webCallbackUri;

	public get user$(): Observable<User | undefined | null> {
		return this.auth0.user$;
	}

	public get isAuthenticated$(): Observable<boolean> {
		return this.auth0.isAuthenticated$;
	}

	public login(): Observable<void> {
		return this.auth0.loginWithRedirect({
			openUrl(url: string) {
				Browser.open({ url: url, windowName: '_self' });
			}
		});
	}

	public acquireTokenSilently(): Observable<string> {
		return this.auth0.getAccessTokenSilently({
			authorizationParams: {
				redirect_uri: AuthService.redirectCallback,
				audience: environment.auth.audience
			}
		});
	}

	public logout() {
		this.auth0
			.logout({
				logoutParams: {
					returnTo: environment.auth.logoutRedirectUri
				}
			})
			.pipe(takeUntilDestroyed())
			.subscribe();
	}
}
