export const environment = {
	production: true,
	auth: {
		domain: 'findme-prod.eu.auth0.com',
		clientId: '5Y8M4fLV05tX8d1WXOjUy9EzCT2YiTdZ',
		webCallbackUri: 'https://find-me.life/home',
		logoutRedirectUri: 'http://find-me.life/login',
		audience: 'https://findme-prod.eu.auth0.com/api/v2/',
		namespace: 'https://api.find-me.life'
	},
	api: {
		url: 'https://api.find-me.life'
	}
};
