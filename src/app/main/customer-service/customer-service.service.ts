import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { AddressTrans } from 'app/shared/class/address';
import { AppService } from 'app/app.service';
import { SalesOrder } from 'app/shared/class/sales-order';

@Injectable()
export class CustomerServiceService implements OnDestroy {
    onSalesOrderSelected: BehaviorSubject<any>;
    onSalesOrderLineSelected: BehaviorSubject<any>;
    private apiURL = environment.webapiURL;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _httpClient: HttpClient,
        private _service: NotificationsService,
        private appService: AppService
    ) {
        this.onSalesOrderSelected = new BehaviorSubject({});
        this.onSalesOrderLineSelected = new BehaviorSubject({});
        this._unsubscribeAll = new Subject();
    }
    getSalesOrder(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/salesorder/' + id)
            .pipe(
                tap((data: SalesOrder) => {
                    this.onSalesOrderSelected.next(data);
                    this.getAddress(data.ShippingAddressTransID)
                        .subscribe((shippingAddress) => {
                            this.onSalesOrderSelected.next({...this.onSalesOrderSelected.value, shippingAddress});
                        });
                    this.getAddress(data.BillingAddressTransID)
                        .subscribe((billingAddress) => {
                            this.onSalesOrderSelected.next({...this.onSalesOrderSelected.value, billingAddress});
                        });
                }),
                catchError(this.appService.handleError)
            );
    }
    getAddress(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/address/' + id)
            .pipe(
                catchError(this.appService.handleError)
            );
    }
    updateAddress(id: string, body: AddressTrans): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/address/' + id, body)
            .pipe(
                catchError(this.appService.handleError)
            );
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
