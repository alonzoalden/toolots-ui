import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
    // npm i angular-oauth2-oidc --save
    // Reference : https://github.com/manfredsteyer/angular-oauth2-oidc
    // Url of the Identity Provider
    issuer: environment.authIssuer,

    // userinfoEndpoint: environment.authIssuer + 'openid/connect/v1/userinfo',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/',

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: environment.authclientId,

    oidc: true,
    requestAccessToken : true,
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile roles api vendor member',

    // URL of the SPA to redirect the user after silent refresh
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html'
};
