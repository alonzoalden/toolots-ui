import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Member } from './shared/class/member';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    wasLoggedIn: boolean;
    userInfo: any;
    member: Member;
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

    getAllMembers(): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/member')
            .pipe(
                tap(data => {
                }),
                catchError(this.handleError)
            );
    }
    getCurrentMember(): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/member/current')
            .pipe(
                tap(data => {
                    this.member = data;
                }),
                catchError(this.handleError)
            );
    }
    getMember(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/member/' + id)
            .pipe(
                tap(data => {
                }),
                catchError(this.handleError)
            );
    }
    handleError = (err: HttpErrorResponse) => {
        let errorMessage: string;
        if (err.error instanceof Error) {
            errorMessage = `Network error: ${err.message}`;
        } else {
            errorMessage = `Response error: ${err.message}`;
        }
        return throwError(errorMessage);
    }
}
