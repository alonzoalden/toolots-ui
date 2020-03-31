import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { Item } from 'app/shared/class/item';

@Injectable()
export class WarehouseItemManagerService {
    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;
    allitemlist: BehaviorSubject<any>;
    isEdit: BehaviorSubject<any>;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: BehaviorSubject<any>;

    private apiURL = environment.webapiURL;

    constructor(
        private _httpClient: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Set the defaults
        this.onFilesChanged = new BehaviorSubject({});
        this.onFileSelected = new BehaviorSubject({});
        this.allitemlist = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.searchTerm = new BehaviorSubject('');
    }

    getAllItemList1(): any {
        this._httpClient.get<any>(this.apiURL + '/item/allitemlist')
            .subscribe(
                data => {
                    this.allitemlist.next(data);
                },
                error => {
                    console.log(error);
                },
            );
    }

    getAllItemList(): Observable<any> {
        if (this.allitemlist.value.length) {
            return this.allitemlist;
        }
        return this._httpClient.get<any>(this.apiURL + '/item/allitemlist')
            .pipe(
                tap(data => {
                    this.allitemlist.next(data);
                }),
                catchError(this.handleError)
            );
    }

    getItemDimension(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/item/' + id)
            .pipe(
                tap(data => {
                    this.onFileSelected.value.Data = data;
                    this.onFileSelected.next(this.onFileSelected.value);
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
