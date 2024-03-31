export const environment = {
  production: true,
  auth: {
    // TODO: Add production auth0 configuration
    domain: 'findme-dev.eu.auth0.com',
    clientId: 'dQQU9Dtorl9YUJPUwqBRwJLWoAAlU24T',
    webCallbackUri: 'http://localhost:8100/home',
    logoutRedirectUri: 'http://localhost:8100/login',
    audience:
      'http://findme.execute-api.localhost.localstack.cloud:4566/local/',
  },
  api: {
    url: 'http://localhost:3000',
  },
};
