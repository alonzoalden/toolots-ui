import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { Fulfillment } from 'app/shared/class/fulfillment';
import { DOCUMENT } from '@angular/common';
import { CustomerServiceService } from '../../customer-service.service';
import { SalesOrder, SalesOrderLine } from 'app/shared/class/sales-order';
import { NotificationsService } from 'angular2-notifications';
// import { SelectShippingTypeDialogComponent } from './dialogs/select-shipping-type/select-shipping-type.component';
// import { AddFulfillmentDialogComponent } from './dialogs/add-fulfillment/add-fulfillment.component';

@Component({
    selector: 'sales-order-list',
    templateUrl: './sales-order-list.component.html',
    styleUrls: ['./sales-order-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CustomerServiceSalesOrderListComponent implements OnInit, OnDestroy {
    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    displayedColumns = ['Actions', 'ItemImagePath', 'ItemName', 'ItemTPIN', 'ItemVendorSKU', 'detail-button'];
    selected: any;
    pIndex: number;
    isLoading: boolean;
    isRefreshing: boolean;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    dialogRef: any;
    interval: any;
    currentSnackBar: any;
    shippingMethod: string;
    inputEnabled: boolean;
    selectedSalesOrder: SalesOrder;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: ElementRef;

    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        // public warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        public salesOrderService: CustomerServiceService,
        private _service: NotificationsService,
        @Inject(DOCUMENT) document
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
        this.inputEnabled = true;
    }

    ngOnInit(): void {
        // this.salesOrderService.loadSalesOrderList();
    }

    // ngAfterViewInit() {
    //     this.focusMainInput();
    // }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        clearInterval(this.interval);
    }

    onSearch(): void {
        if (!this.searchTerm) {
            return;
        }
        if (this.currentSnackBar) {
            this.currentSnackBar.dismiss();
        }
        this.isLoading = true;
        this.salesOrderService.getSalesOrder(this.searchTerm)
            .subscribe(
                (order: SalesOrder) => {
                    this.selectedSalesOrder = order;
                    if (order.SalesOrderLines.length) {
                        // create dataSource when we first get items
                        this.dataSource = new MatTableDataSource<SalesOrderLine>(order.SalesOrderLines);
                        this.dataSource.sort = this.sort;
                    }
                    this.isLoading = false;
                },
                (error: any) => {
                    this._service.error('Oops!', `Please check the order number.`, {timeOut: 3000, clickToClose: true});
                    this.isLoading = false;
                },
            );
    }

    onSelect(selected: Fulfillment): void {
        this.searchTerm = '';
        // this.warehouseOutboundService.onFulfillmentSelected.next(selected);
        // this.warehouseOutboundService.getFulfillment(selected.FulfillmentID)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe();
    }

    refreshFulfillments() {
        this.isRefreshing = true;
        // this.warehouseOutboundService.getFulfillmentList()
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(items => {
        //         if (items.length) {

        //             // if dataSource already exists, just replace dataSource.data with items
        //             if (this.dataSource) {
        //                 this.dataSource.data = items;

        //                 // if something is already selected
        //                 if (this.selected.FulfillmentID) {
        //                     this.reselectAfterRefresh();
        //                 }
        //             }

        //             // create dataSource when we first get items
        //             else {
        //                 this.dataSource = new MatTableDataSource<Fulfillment>(items);
        //                 this.dataSource.sort = this.sort;
        //                 // this.dataSource.paginator = this.paginator;
        //             }
        //             this.isLoading = false;
        //             this.isRefreshing = false;
        //             setTimeout(() => {
        //                 this.focusMainInput();
        //             }, 1);
        //         }
        //     });
    }

    reselectAfterRefresh() {
        // const foundItem = this.dataSource.data.find((item: Fulfillment) => item.FulfillmentID === this.selected.FulfillmentID);
        // if (foundItem) {
        //     // this.warehouseOutboundService.onFulfillmentSelected.next(foundItem);
        // }
        // else {
        //     console.log('your selected item has been removed from the list');
        // }
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
        this.toggleSearch();
        this.searchTerm = '';
        this.filterBySearchTerm();
    }

    /**
     * Filter courses by term
     */
    filterBySearchTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if (searchTerm === '') {
            this.filteredCourses = this.dataSource.data;
        }
        else {
            this.filteredCourses = this.dataSource.data.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }

    applySearch(searchValue: string) {
        if (!searchValue) {
            return;
        }
        if (this.currentSnackBar) {
            this.currentSnackBar.dismiss();
        }

        // find fulfillment from new list
        const foundFulfillment = this.dataSource.data.find((fulfillment: Fulfillment) => {
            return fulfillment.FulfillmentNumber.toLowerCase() === searchValue.toLowerCase();
        });

        if (!foundFulfillment) {
            this.currentSnackBar = this._snackBar.openFromComponent(SnackbarComponent, {
                data: { type: 'error', message: `Fulfillment not found.` }, duration: 2000
            });
            if (!this.shippingMethod) {
                this.shippingTypeDialog();
            }
            else {
                this.addFulfillmentDialog();
            }
            // return  this.warehouseOutboundService.clearSelected();
            return;
        }
        // find fulfillmentIndex from new list
        // const foundFulfillmentIndex = this.dataSource.data.findIndex((fulfillment: Fulfillment) => {
        //     return fulfillment.FulfillmentNumber.toLowerCase() === searchValue.toLowerCase();
        // });
        // set paginator from fulfillmentIndex by pageSize
        // this.dataSource.paginator.pageIndex = Math.floor(foundFulfillmentIndex / this.paginator.pageSize);
        this.dataSource.data = this.dataSource.data;

        // set foundFulfillment to be selected
        // this.warehouseOutboundService.onFulfillmentSelected.next(foundFulfillment);
        this.onSelect(foundFulfillment);
        // this._snackBar.openFromComponent(SnackbarComponent, {
        //     data: { type: 'success', message: `${foundFulfillment.FulfillmentNumber} located.` },
        // });

        // timeout to make sure page loads then scroll item into view
        setTimeout(() => {
            document.getElementById(foundFulfillment.FulfillmentID).scrollIntoView({block: 'center'});
        }, 10);

    }
    shippingTypeDialog(): void {
        // this.inputEnabled = false;
        // this.dialogRef = this._matDialog.open(SelectShippingTypeDialogComponent, {
        //     panelClass: 'edit-fields-dialog',
        //     autoFocus: false
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe(shippingtype => {
        //         this.inputEnabled = true;
        //         this.focusMainInput();
        //         if (!shippingtype) {
        //             return;
        //         }
        //         this.shippingMethod = shippingtype;
        //         // this._snackBar.openFromComponent(SnackbarComponent, {
        //         //     data: { type: 'success', message: `Shipping Type has been set to: ${shippingtype}.` },
        //         // });
        //         this.addFulfillmentDialog();
        //     });
    }
    addFulfillmentDialog(): void {
        // this.inputEnabled = false;
        // const term = this.searchTerm;
        // this.searchTerm = '';
        // const _data = {
        //     ShippingMethod: this.shippingMethod,
        //     FulfillmentNumber: term,
        // };
        // this.dialogRef = this._matDialog.open(AddFulfillmentDialogComponent, {
        //     panelClass: 'edit-fields-dialog',
        //     disableClose: true,
        //     data: _data,
        //     autoFocus: false
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe(data => {
        //         this.inputEnabled = true;
        //         this.focusMainInput();
        //         if (!data) {
        //             return;
        //         }
        //     });
    }
    focusMainInput() {
        if (this.inputEnabled) {
            this.mainInput.nativeElement.focus();
        }
    }
}
