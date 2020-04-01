import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { Item } from 'app/shared/class/item';

@Injectable()
export class WarehouseItemManagerService implements OnDestroy {
    onItemSelected: BehaviorSubject<any>;
    allItemList: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;

    private apiURL = environment.webapiURL;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _httpClient: HttpClient,
    ) {
        this.onItemSelected = new BehaviorSubject({});
        this.allItemList = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.searchTerm = new BehaviorSubject('');
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadAllItemList(): any {
        this._httpClient.get<any>(this.apiURL + '/item/allitemlist')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => {
                    this.allItemList.next(data);
                },
                error => {
                    console.log(error);
                },
            );
    }

    getAllItemList(): Observable<any> {
        if (this.allItemList.value.length) {
            return this.allItemList;
        }
        return this._httpClient.get<any>(this.apiURL + '/item/allitemlist')
            .pipe(
                tap(data => {
                    this.allItemList.next(data);
                }),
                catchError(this.handleError)
            );
    }

    getItemDimension(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/item/' + id)
            .pipe(
                tap(data => {
                    this.onItemSelected.value.Data = data;
                    this.onItemSelected.next(this.onItemSelected.value);
                }),
                catchError(this.handleError)
            );
    }

    editItemDimension(itemdimension: Item): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/item/' + itemdimension.ItemID, itemdimension)
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
