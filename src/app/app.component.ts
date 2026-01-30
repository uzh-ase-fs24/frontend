import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService as Auth0 } from '@auth0/auth0-angular';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { mergeMap } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	constructor(private auth: Auth0, private ngZone: NgZone) {}

	ngOnInit(): void {
    // 1. Handle the GitHub Pages "Hack" for query params
    this.route.queryParams.subscribe(params => {
      if (params['riddleId']) {
        this.router.navigate(['/riddle', params['riddleId']]);
      }
    });
		// Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
		App.addListener('appUrlOpen', ({ url }) => {
			// Must run inside an NgZone for Angular to pick up the changes
			// https://capacitorjs.com/docs/guides/angular
			this.ngZone.run(() => {
				if (url?.startsWith(AuthService.redirectCallback)) {
					// If the URL is an authentication callback URL..
					if (url.includes('state=') && (url.includes('error=') || url.includes('code='))) {
						// Call handleRedirectCallback and close the browser
						this.auth
							.handleRedirectCallback(url)
							.pipe(mergeMap(() => Browser.close()))
							.subscribe();
					} else {
						Browser.close();
					}
				}
			});
		});
	}
}
