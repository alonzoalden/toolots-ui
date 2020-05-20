import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class CustomerServiceService implements OnDestroy {
    selectedSalesOrder: BehaviorSubject<any>;
    private apiURL = environment.webapiURL;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _httpClient: HttpClient,
        private _service: NotificationsService,
    ) {
        // this.onFulfillmentLinePackageSelected = new BehaviorSubject({});
        // this.onPickInputEnabled = new BehaviorSubject(true);
        // this.salesOrderList = new BehaviorSubject([]);
        this.selectedSalesOrder = new BehaviorSubject({});
        this._unsubscribeAll = new Subject();
    }
    getSalesOrder(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/salesorder/' + id)
            .pipe(
                tap(data => {
                    this.selectedSalesOrder.next(data);
                }),
                catchError(this.handleError)
            );
    }
    // getSalesOrderList(): Observable<any> {
    //     return this._httpClient.get<any>(this.apiURL + '/salesorder')
    //         .pipe(
    //             tap(data => {
    //                 this.salesOrderList.next(data);
    //             }),
    //             catchError(this.handleError)
    //         );
    // }
    // loadSalesOrderList(): any {
    //     this._httpClient.get<any>(this.apiURL + '/salesorder')
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(
    //             data => {
    //                 this.salesOrderList.next(data);
    //             },
    //             error => {
    //                 console.log(error);
    //             },
    //         );
    // }
    
    handleError = (err: HttpErrorResponse) => {
        let errorMessage: string;
        if (err.error instanceof Error) {
            errorMessage = `Network error: ${err.error}`;
        } else {
            errorMessage = `Response error: ${err.error.Message}`;
        }
        return throwError(errorMessage);
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
