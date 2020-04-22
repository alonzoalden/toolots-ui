import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm } from 'app/shared/class/fulfillment';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class WarehouseOutboundService {
    onFulfillmentSelected: BehaviorSubject<any>;
    onFulfillmentLineSelected: BehaviorSubject<any>;
    onFulfillmentLineConfirmSelected: BehaviorSubject<any>;
    onPickInputEnabled: BehaviorSubject<any>;
    outboundList: BehaviorSubject<any>;
    locationBinList: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;

    private apiURL = environment.webapiURL;

    constructor(
        private _httpClient: HttpClient,
        private _service: NotificationsService
    ) {
        // Set the defaults
        this.onFulfillmentSelected = new BehaviorSubject({});
        this.onFulfillmentLineSelected = new BehaviorSubject({});
        this.onFulfillmentLineConfirmSelected = new BehaviorSubject({});
        this.onPickInputEnabled = new BehaviorSubject(true);
        this.outboundList = new BehaviorSubject([]);
        this.locationBinList = new BehaviorSubject([]);
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

    getLocationBinList(): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/location/binlist')
            .pipe(
                tap(data => {
                    this.locationBinList.next(data);
                }),
                catchError(this.handleError)
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
    addPickUpFulfillment(body: {FulfillmentNumber, ShippingMethod}): Observable<any> {
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
        if (fulfillmentline.confirmedQty !== 0 && (fulfillmentline.confirmedQty < fulfillmentline.Quantity)) {
            fulfillmentline.IsPicked = false;
            // return this._service.error('Error', 'Pick set to No', {timeOut: 3000, clickToClose: true});
        }
    }
    setMissing(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.IsPicked && fulfillmentline.IsNotFound) {
            fulfillmentline.IsNotFound = false;
        }
    }
    setPicked(fulfillmentline: FulfillmentLine) {
        if (fulfillmentline.IsNotFound && fulfillmentline.IsPicked) {
            fulfillmentline.IsPicked = false;
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
}
