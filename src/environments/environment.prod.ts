
export const environment = {
  production: true,
  auth: {
    // TODO: Add production auth0 configuration
    domain: 'dev-ss50z3434hodufar.us.auth0.com',
    clientId: 'XUo9dyc9aEJaC5im9tvutQmDRzeoNZU9',
    webCallbackUri: 'http://localhost:8100/home',
    logoutRedirectUri: 'http://localhost:8100/login',
  },
  api: {
    url: 'http://localhost:3000',
  },
};
