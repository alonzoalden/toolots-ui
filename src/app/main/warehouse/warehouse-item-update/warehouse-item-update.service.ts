import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, RouterLink, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject, throwError, forkJoin, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Item } from 'app/shared/class/item';

@Injectable()
export class WarehouseItemUpdateService implements Resolve<any>
{
    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;
    allitemlist: BehaviorSubject<any>;
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
        this.allitemlist = new BehaviorSubject([]);
        this.isEdit = new BehaviorSubject({});
        this.searchTerm = new BehaviorSubject('');
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return combineLatest([
            // this.getFiles()
        ]);
    }

    /**
     * Get files
     *
     * @returns {Promise<any>}
     */

    // getFiles(): Observable<any> {
    //     return this._httpClient.get('api/file-manager')
    //         .pipe(
    //             tap(data => {
    //                     this.onFilesChanged.next(data);
    //                     // this.onFileSelected.next(data[0]);
    //             }),
    //             catchError(this.handleError)
    //         );
    // }
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
                    // const updatedData = Object.assign({}, this.onFileSelected.value);
                    // updatedData.Dimensions = data;
                    // this.onFileSelected.next(updatedData);

                    this.onFileSelected.value.Data = data;
                    this.onFileSelected.next(this.onFileSelected.value);
                }),
                catchError(this.handleError)
            );
    }

    editItemDimension(itemdimension: Item): Observable<any> {
        return this._httpClient.put<any>(this.apiURL + '/item/' + itemdimension.ItemID, itemdimension)
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