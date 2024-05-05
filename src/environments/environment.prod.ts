export const environment = {
	production: true,
	auth: {
		// TODO: Add production auth0 configuration
		domain: 'findme-dev.eu.auth0.com',
		clientId: 'dQQU9Dtorl9YUJPUwqBRwJLWoAAlU24T',
		webCallbackUri: 'https://find-me.life/home',
		logoutRedirectUri: 'http://find-me.life/login',
		audience: 'https://findme-dev.eu.auth0.com/api/v2/',
		namespace: 'https://findme.ch'
	},
	api: {
		url: 'https://api.find-me.life'
	}
};
