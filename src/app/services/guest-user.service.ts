import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GuestUserService {
	private readonly GUEST_USERNAME_KEY = 'guest_username';

	initializeGuestUser(): string {
		let guestUsername = localStorage.getItem(this.GUEST_USERNAME_KEY);

		if (!guestUsername) {
			// Generate a unique guest username
			const uniqueId = this.generateUniqueId();
			guestUsername = `guest_${uniqueId}`;
			localStorage.setItem(this.GUEST_USERNAME_KEY, guestUsername);
		}

		return guestUsername;
	}

	getGuestUsername(): string {
		return localStorage.getItem(this.GUEST_USERNAME_KEY) || this.initializeGuestUser();
	}

	private generateUniqueId(): string {
		// Generate a unique ID using timestamp and random number
		const timestamp = Date.now().toString(36);
		const randomPart = Math.random().toString(36).substring(2, 8);
		return `${timestamp}${randomPart}`;
	}
}
