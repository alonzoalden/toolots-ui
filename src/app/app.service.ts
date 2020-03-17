import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    wasLoggedIn: boolean;
    userInfo: any;
    private apiURL = environment.webapiURL;

    constructor(
        private oauthService: OAuthService,
        private _httpClient: HttpClient
    ) { }
    get isLoggedin() {
        return (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken());
    }
    setWasLoggedIn() {
        this.wasLoggedIn = true;
    }
    getWasLoggedIn() {
        return this.wasLoggedIn;
    }
    logout() {
        this.oauthService.logOut();
    }
}
