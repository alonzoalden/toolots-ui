import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, RouterLink, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject, throwError, forkJoin, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Item } from 'app/shared/class/item';
import { Fulfillment } from 'app/shared/class/fulfillment';

@Injectable()
export class WarehouseOutboundService implements Resolve<any> {
    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;
    outboundList: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;

    private apiURL = environment.webapiURL;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Set the defaults
        this.onFilesChanged = new BehaviorSubject({});
        this.onFileSelected = new BehaviorSubject({});
        this.outboundList = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.searchTerm = new BehaviorSubject('');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return combineLatest([
            // this.getFiles()
        ]);
    }


    getFulfillmentList(): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/fulfillment/outbound')
            .pipe(
                tap(data => {
                    this.outboundList.next(data);
                }),
                catchError(this.handleError)
            );
    }

    getFulfillment(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/fulfillment/' + id)
            .pipe(
                tap(data => {
                    // const updatedData = Object.assign({}, this.onFileSelected.value);
                    // updatedData.Dimensions = data;
                    // this.onFileSelected.next(updatedData);

                    this.onFileSelected.value.Data = data;
                    this.onFileSelected.next(this.onFileSelected.value);
                }),
                catchError(this.handleError)
            );
    }

    editFulfillment(body: Fulfillment): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/fulfillment/' + body.FulfillmentID, body)
            .pipe(
                // tap(data => {
                //     this.allitemlist.next(data);
                // }),
                catchError(this.handleError)
            );
    }

    handleError = (err: HttpErrorResponse) => {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            // errorMessage = `An error occurred: ${err.error.message}`;
            errorMessage = `Network error: ${err.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // errorMessage = `Backend returned code ${err.status}, body was: ${err.error.Message}`;
            errorMessage = `Response error: ${err.message}`;
            // this.router.navigate(['errors/error-500'], { state: { message: err.message }});
        }
        return throwError(errorMessage);
    }
}