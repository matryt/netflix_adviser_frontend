export const environment = {
  production: false,
  auth: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
      redirect_uri: 'YOUR_REDIRECT_URI',
      audience: 'YOUR_API_AUDIENCE',
      scope: 'openid profile email'
    }
  }
};