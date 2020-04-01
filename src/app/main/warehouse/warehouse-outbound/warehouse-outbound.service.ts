import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Fulfillment } from 'app/shared/class/fulfillment';

@Injectable()
export class WarehouseOutboundService {
    onFulfillmentSelected: BehaviorSubject<any>;
    outboundList: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;

    private apiURL = environment.webapiURL;

    constructor(
        private _httpClient: HttpClient,
    ) {
        // Set the defaults
        this.onFulfillmentSelected = new BehaviorSubject({});
        this.outboundList = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.searchTerm = new BehaviorSubject('');
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
                    this.onFulfillmentSelected.value.FulfillmentLines = data;
                    this.onFulfillmentSelected.next(this.onFulfillmentSelected.value);
                }),
                catchError(this.handleError)
            );
    }

    editFulfillment(body: Fulfillment): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/fulfillment/' + body.FulfillmentID, body)
            .pipe(
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
