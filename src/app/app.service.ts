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

    setWasLoggedIn() {
        this.wasLoggedIn = true;
    }

    getWasLoggedIn() {
        return this.wasLoggedIn;
    }
    get isLoggedin() {
        return (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken());
    }
    logout() {
        this.oauthService.logOut();
    }
}
