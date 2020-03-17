import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, throwError, forkJoin, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Injectable()
export class WarehouseItemUpdateService implements Resolve<any>
{
    onFilesChanged: BehaviorSubject<any>;
    onFileSelected: BehaviorSubject<any>;
    allitemlist: BehaviorSubject<any>;
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
        this.allitemlist = new BehaviorSubject({});
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
            this.getFiles()
        ]);

        // return new Promise((resolve, reject) => {

        //     Promise.all([
        //         this.getFiles(),
        //         // this.getItems()
        //     ]).then(
        //         ([files]) => {
        //             resolve();
        //         },
        //         reject
        //     );
        // });
    }

    /**
     * Get files
     *
     * @returns {Promise<any>}
     */
    // getFiles(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get('api/file-manager')
    //             .subscribe((response: any) => {
    //                 this.onFilesChanged.next(response);
    //                 this.onFileSelected.next(response[0]);
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    // getItems(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get(this.apiURL + '/item/2')
    //             .subscribe((response: any) => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    getFiles(): Observable<any> {

        return this._httpClient.get('api/file-manager')
            .pipe(
                tap(data => {
                        this.onFilesChanged.next(data);
                        // this.onFileSelected.next(data[0]);
                }),
                catchError(this.handleError)
            );
    }

    getAllItemList(): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/warehouse/allitemlist')
            .pipe(
                tap(data => {
                    this.allitemlist.next(data);
                }),
                catchError(this.handleError)
            );
    }

    getItemDimension(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/warehouse/itemdimension/' + id)
            .pipe(
                // tap(data => {
                // }),
                catchError(this.handleError)
            );
    }

    editItemDimension(id: string): Observable<any> {
        return this._httpClient.get<any>(this.apiURL + '/warehouse/itemdimension/' + id)
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
