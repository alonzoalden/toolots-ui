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
import { Fulfillment, FulfillmentLine } from 'app/shared/class/fulfillment';
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
export class CustomerServiceSalesOrderListComponent implements OnInit, OnDestroy, AfterViewInit {
    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    displayedColumns = ['ItemImagePath', 'ItemName', 'ItemTPIN', 'ItemVendorSKU', 'Quantity', 'Complete'];
    selected: any;
    pIndex: number;
    isLoading: boolean;
    isRefreshing: boolean;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    dialogRef: any;
    currentSnackBar: any;
    shippingMethod: string;
    inputEnabled: boolean;
    selectedSalesOrder: SalesOrder;
    selectedSalesOrderLine: SalesOrderLine;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: ElementRef;

    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        // public warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        public csService: CustomerServiceService,
        private notifyService: NotificationsService,
        @Inject(DOCUMENT) document
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
        this.inputEnabled = true;
    }

    ngOnInit(): void {
        this.csService.onSalesOrderSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((order: SalesOrder) => {
                if (!order.SalesOrderID) {
                    this.selectedSalesOrder = null;
                    this.dataSource = null;
                }
                if (order.SalesOrderID && order.SalesOrderLines) {
                    const updatedSalesOrderLines = order.SalesOrderLines
                        .map((orderline: SalesOrderLine) => {
                            let count = 0;
                            if (order.Fulfillments) {
                                order.Fulfillments.forEach((fulfillment: Fulfillment) => {
                                    if (fulfillment.FulfillmentLines) {
                                        fulfillment.FulfillmentLines.forEach((fulfillmentline: FulfillmentLine) => {
                                            if (fulfillmentline.ItemID === orderline.ItemID) {
                                                count += fulfillmentline.Quantity;
                                            }
                                        });
                                    }
                                });
                            }
                            if (count === orderline.Quantity) {
                                orderline.complete = true;
                            }
                            else {
                                orderline.complete = false;
                            }
                            return orderline;
                        });
                    order.SalesOrderLines = updatedSalesOrderLines;
                    this.selectedSalesOrder = order;
                    this.dataSource = new MatTableDataSource<SalesOrderLine>(order.SalesOrderLines);
                    this.dataSource.sort = this.sort;
                }
            });
        this.csService.onSalesOrderLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((order: SalesOrderLine) => {
                this.selectedSalesOrderLine = order;
            });
    }

    ngAfterViewInit() {
        this.focusMainInput();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.csService.onSalesOrderSelected.next({});
        this.csService.onSalesOrderLineSelected.next({});
    }

    onSearch(): void {
        if (!this.searchTerm) {
            return;
        }
        if (this.currentSnackBar) {
            this.currentSnackBar.dismiss();
        }
        this.isLoading = true;
        this.csService.onSalesOrderSelected.next({});
        this.selectedSalesOrder = null;
        if (this.dataSource) {
            this.dataSource = null;
        }
        this.csService.getSalesOrder(this.searchTerm)
            .subscribe(
                () => this.isLoading = false,
                () => {
                    this.notifyService.error('Oops!', `Please check the order number.`, {timeOut: 3000, clickToClose: true});
                    this.isLoading = false;
                },
            );
    }

    onSelect(selected: SalesOrderLine): void {
        // this.searchTerm = '';
        this.csService.onSalesOrderLineSelected.next(selected);
        // this.warehouseOutboundService.getFulfillment(selected.FulfillmentID)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe();
    }

    toggleSidebar(name): void {
        // this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
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
    focusMainInput() {
        if (this.inputEnabled) {
            this.mainInput.nativeElement.focus();
        }
    }
}
