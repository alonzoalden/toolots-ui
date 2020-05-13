import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm } from 'app/shared/class/fulfillment';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class WarehouseOutboundService {
    onFulfillmentSelected: BehaviorSubject<any>;
    onFulfillmentLineSelected: BehaviorSubject<any>;
    onFulfillmentLineConfirmSelected: BehaviorSubject<any>;
    onFulfillmentLinePackageSelected: BehaviorSubject<any>;
    onPickInputEnabled: BehaviorSubject<any>;
    outboundList: BehaviorSubject<any>;
    locationBinList: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    editConfirmQuantity: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;
    private apiURL = environment.webapiURL;
    private _unsubscribeAll: Subject<any>;
    buttonColorDict = {
        'Pack': 'purple',
        'Mark Ship': 'green',
        'Pick': 'blue',
    };
    constructor(
        private _httpClient: HttpClient,
        private _service: NotificationsService,
    ) {
        // Set the defaults
        this.onFulfillmentSelected = new BehaviorSubject({});
        this.onFulfillmentLineSelected = new BehaviorSubject({});
        this.onFulfillmentLineConfirmSelected = new BehaviorSubject({});
        this.onFulfillmentLinePackageSelected = new BehaviorSubject({});
        this.onPickInputEnabled = new BehaviorSubject(true);
        this.outboundList = new BehaviorSubject([]);
        this.locationBinList = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.editConfirmQuantity = new BehaviorSubject(null);
        this.searchTerm = new BehaviorSubject('');
        this._unsubscribeAll = new Subject();
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

    getLocationBinList(): void {
        this._httpClient.get<any>(this.apiURL + '/location/binlist')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    this.locationBinList.next(data);
                },
                error => {
                    console.log(error);
                },
            );
    }

    getFulfillment(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/fulfillment/' + id)
            .pipe(
                tap((data: Fulfillment) => {
                    this.onFulfillmentSelected.value.FulfillmentLines = data.FulfillmentLines;
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
    addPickUpFulfillment(body: { FulfillmentNumber, ShippingMethod }): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/fulfillment/pickup', body)
            .pipe(
                catchError(this.handleError)
            );
    }
    updatePickFulfillmentLine(body: FulfillmentLine): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/fulfillment/fulfillmentline', body)
            .pipe(
                tap(data => {
                    // const index = this.onFulfillmentSelected.value.FulfillmentLines
                    //     .findIndex((line: FulfillmentLine) => line.FulfillmentLineID === data.FulfillmentLineID);
                    // this.onFulfillmentSelected.value.FulfillmentLines[index] = data;
                    // this.onFulfillmentSelected.next(this.onFulfillmentSelected.value);
                }),
                catchError(this.handleError)
            );
    }

    clearSelected() {
        this.onFulfillmentSelected.next({});
    }

    setTotalConfirmedQty(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.FulfillmentLineConfirms) {
            fulfillmentline.confirmedQty = fulfillmentline.FulfillmentLineConfirms
                .reduce((total, val) => total += val.Quantity, 0);
        }
    }

    copyInventoryDetailsIntoConfirms(fulfillmentline) {
        if (fulfillmentline.confirmedQty === 0 && (fulfillmentline.Quantity > 0)) {
            const confirms = fulfillmentline.FulfillmentLineInventoryDetails
                .map(detail => new FulfillmentLineConfirm(null, detail.BinNumber, detail.Quantity));
            fulfillmentline.FulfillmentLineConfirms = confirms;
        }
    }

    setPickedBasedOffQty(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.confirmedQty !== 0 && fulfillmentline.confirmedQty < fulfillmentline.Quantity) {
            fulfillmentline.IsPicked = false;
            this._service.error('Warning', `${fulfillmentline.ItemTPIN} can not be picked`, { timeOut: 3000, clickToClose: true });
            return false;
        }
        return true;
    }
    setMissing(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.IsPicked && fulfillmentline.IsNotFound) {
            fulfillmentline.IsNotFound = false;
            this._service.success('Warning', `${fulfillmentline.ItemTPIN} set to missing`, { timeOut: 3000, clickToClose: true });
        }
    }
    setPicked(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.IsNotFound && fulfillmentline.IsPicked) {
            fulfillmentline.IsPicked = false;
            this._service.error('Warning', `${fulfillmentline.ItemTPIN} has been unpicked`, { timeOut: 3000, clickToClose: true });
        }
    }

    handleError = (err: HttpErrorResponse) => {
        let errorMessage: string;
        if (err.error instanceof Error) {
            errorMessage = `Network error: ${err.error}`;
        } else {
            errorMessage = `Response error: ${err.error.Message}`;
        }
        return throwError(errorMessage);
    }

    toggleEnterConfirmedQty() {
        this.editConfirmQuantity.next(
            !this.editConfirmQuantity.value
        );
    }
}
