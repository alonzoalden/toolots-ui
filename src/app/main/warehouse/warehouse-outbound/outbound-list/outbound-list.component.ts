import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseOutboundService } from '../warehouse-outbound.service';
import { ItemList } from 'app/shared/class/item';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-manager/dialogs/edit-dimensions/edit-dimensions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { Fulfillment } from 'app/shared/class/fulfillment';
import { WarehouseItemManagerService } from '../../warehouse-item-manager/warehouse-item-manager.service';
import { DOCUMENT } from '@angular/common';
import { SelectShippingTypeDialogComponent } from '../dialogs/select-shipping-type/select-shipping-type.component';
import { AddFulfillmentDialogComponent } from '../dialogs/add-fulfillment/add-fulfillment.component';

@Component({
    selector: 'outbound-list',
    templateUrl: './outbound-list.component.html',
    styleUrls: ['./outbound-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseOutboundListComponent implements OnInit, OnDestroy {
    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    // displayedColumns = ['Actions', 'FulfillmentNumber',
    //     'TransactionDate', 'ShippingMethod', 'PickedUpBy', 'PickedUpOn', 'PickConfirmedBy', 'PickConfirmedOn', 'PickedBy',
    //     'PackedBy', 'PackedOn', 'ShippedBy', 'ShippedOn', 'PickedOn', 'HasMissingItem', 'ShippingType'];
    displayedColumns = ['Actions', 'FulfillmentNumber', 'TransactionDate'];
    selected: any;
    pIndex: number;
    isLoading: boolean;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    dialogRef: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    interval: any;
    currentSnackBar: any;
    shippingType: string;

    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        public warehouseOutboundService: WarehouseOutboundService,
        private warehouseItemManagerService: WarehouseItemManagerService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        @Inject(DOCUMENT) document
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
    }

    ngOnInit(): void {

        this.warehouseOutboundService.onFulfillmentSelected.next({});
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
        this.isLoading = true;
        this.refreshFulfillments();

        // Refresh Fulfillments List every 5 seconds
        this.interval = setInterval(() => {
            this.refreshFulfillments();
        }, 20000);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        clearInterval(this.interval);
    }

    onSelect(selected: Fulfillment): void {
        this.searchTerm = '';
        this.warehouseOutboundService.onFulfillmentSelected.next(selected);
        // this.warehouseOutboundService.getFulfillment(selected.FulfillmentID)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe();
    }

    refreshFulfillments() {
        // this.isLoading = true;
        this.warehouseOutboundService.getFulfillmentList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(items => {
                if (items.length) {

                    // if dataSource already exists, just replace dataSource.data with items
                    if (this.dataSource) {
                        this.dataSource.data = items;

                        // if something is already selected
                        if (this.selected.FulfillmentID) {
                            this.reselectAfterRefresh();
                        }
                    }

                    // create dataSource when we first get items
                    else {
                        this.dataSource = new MatTableDataSource<Fulfillment>(items);
                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;
                        this.isLoading = false;
                    }
                }
            });
    }

    reselectAfterRefresh() {
        const foundItem = this.dataSource.data.find((item: Fulfillment) => item.FulfillmentID === this.selected.FulfillmentID);
        if (foundItem) {
            this.warehouseOutboundService.onFulfillmentSelected.next(foundItem);
        }
        else {
            console.log('your selected item has been removed from the list');
        }
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
            if (!this.shippingType) {
                this.shippingTypeDialog();
            }
            else {
                this.addFulfillmentDialog();
            }
            return this.warehouseOutboundService.clearSelected();



            // open up a popup window that sets a defaultOption variable to
            // "Will Call", "LTL", "Parcel - UPS"
            // After selecting Parcel and clicking OK,
            // open a different window that lets you put it parcel informatoin,
            // on OK make API call, on success, refresh item list
            //    auto select newly created item return item on list.

        }
        // find fulfillmentIndex from new list
        const foundFulfillmentIndex = this.dataSource.data.findIndex((fulfillment: Fulfillment) => {
            return fulfillment.FulfillmentNumber.toLowerCase() === searchValue.toLowerCase();
        });
        // set paginator from fulfillmentIndex by pageSize
        this.dataSource.paginator.pageIndex = Math.floor(foundFulfillmentIndex / this.paginator.pageSize);
        this.dataSource.data = this.dataSource.data;

        // set foundFulfillment to be selected
        this.warehouseOutboundService.onFulfillmentSelected.next(foundFulfillment);

        // timeout to make sure page loads then scroll item into view
        setTimeout(() => {
            document.getElementById(foundFulfillment.FulfillmentID).scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 10);

    }
    shippingTypeDialog(): void {
        this.dialogRef = this._matDialog.open(SelectShippingTypeDialogComponent, {
            panelClass: 'edit-dimensions-dialog',
            disableClose: true
        });
        this.dialogRef.afterClosed()
            .subscribe(shippingtype => {
                if (!shippingtype) {
                    return;
                }
                this.shippingType = shippingtype;
                this._snackBar.openFromComponent(SnackbarComponent, {
                    data: { type: 'success', message: `Shipping Type has been set to: ${shippingtype}.` },
                });
                this.addFulfillmentDialog();
            });
    }
    addFulfillmentDialog(): void {
        this.dialogRef = this._matDialog.open(AddFulfillmentDialogComponent, {
            panelClass: 'edit-dimensions-dialog',
            disableClose: true,
            data: this.shippingType
        });
        this.dialogRef.afterClosed()
            .subscribe(data => {
                if (!data) {
                    return;
                }

                this._snackBar.openFromComponent(SnackbarComponent, {
                    data: { type: 'success', message: `Fulfillment created.` },
                });
            });
    }
}
