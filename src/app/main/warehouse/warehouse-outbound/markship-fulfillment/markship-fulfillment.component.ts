import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseOutboundService } from '../warehouse-outbound.service';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { FulfillmentLine } from 'app/shared/class/fulfillment';
import { WarehouseItemManagerService } from '../../warehouse-item-manager/warehouse-item-manager.service';
import { DOCUMENT } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { FulfillmentPackageDialogComponent } from './fulfillment-package/fulfillment-package.component';

@Component({
    selector: 'markship-fulfillment',
    templateUrl: './markship-fulfillment.component.html',
    styleUrls: ['./markship-fulfillment.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MarkshipFulfillmentComponent implements OnInit, OnDestroy {

    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    displayedColumnsPackingSlip = ['Fulfillment', 'Address1', 'Address2', 'City', 'State', 'Zip'];
    displayedColumnsPackage = ['PackageNumber', 'Length', 'Width', 'Height', 'Weight', 'TrackingNumber'];
    displayedColumnsItem = ['Fulfillment', 'Item', 'BIN', 'ConfirmedBIN', 'OrderedQty', 'PackedQty', 'SelectedPackageQty'];
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
    selectedFulfillmentLine: any;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: ElementRef;

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
        // this.inputEnabled = true;
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.isLoading = false;
                this.selected = selected;
                // add quantities
                if (this.selected.FulfillmentLines) {
                    this.selected.FulfillmentLines.forEach((line: FulfillmentLine) => {
                        this.warehouseOutboundService.setTotalConfirmedQty(line);
                        // this.warehouseOutboundService.setPickedBasedOffQty(line);
                    });
                    if (!this.dataSource) {
                        this.refreshDataSource();
                    }
                    if (!this.selectedFulfillmentLine) {
                        this.onSelect(this.dataSource.data[0]);
                    }
                }
            });
        this.warehouseOutboundService.onFulfillmentLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selectedfulfillmentline: FulfillmentLine) => {
                this.selectedFulfillmentLine = selectedfulfillmentline;
            });
        this.warehouseOutboundService.onPickInputEnabled
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(inputenabled => {
                this.inputEnabled = inputenabled;
            });
        this.warehouseOutboundService.getLocationBinList();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // clearInterval(this.interval);
    }
    refreshDataSource(): void {
        this.dataSource = new MatTableDataSource<FulfillmentLine>(this.selected.FulfillmentLines);
        this.dataSource.sort = this.sort;
    }
    onSelect(fulfillmentline: FulfillmentLine): void {
        this.searchTerm = '';
        this.warehouseOutboundService.onFulfillmentLineSelected.next(fulfillmentline);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
        // this.toggleSearch();
        this.searchTerm = '';
    }

    applySearch(searchValue: string) {
        if (!searchValue) {
            return;
        }
        if (this.currentSnackBar) {
            this.currentSnackBar.dismiss();
        }

        // find fulfillment from new list
        const foundFulfillment = this.dataSource.data.find((fulfillmentline: FulfillmentLine) => {
            return (fulfillmentline.ItemTPIN.toLowerCase() === searchValue.toLowerCase()
                || fulfillmentline.ItemSKU.toLowerCase() === searchValue.toLowerCase());
        });

        if (!foundFulfillment) {
            this.currentSnackBar = this._snackBar.openFromComponent(SnackbarComponent, {
                data: { type: 'error', message: `Fulfillment Line not found.` }, duration: 2000
            });
            return this.warehouseOutboundService.clearSelected();
        }
        this.dataSource.data = this.dataSource.data;

        // set foundFulfillment to be selected
        this.warehouseOutboundService.onFulfillmentSelected.next(foundFulfillment);

        // timeout to make sure page loads then scroll item into view
        setTimeout(() => {
            document.getElementById(foundFulfillment.FulfillmentID).scrollIntoView({ block: 'center' });
        }, 10);
    }
    openDialogFulfillmentPackage(): void {
        this.warehouseOutboundService.onPickInputEnabled.next(false);
        this.dialogRef = this._matDialog.open(FulfillmentPackageDialogComponent, {
            panelClass: 'edit-dimensions-dialog',
            autoFocus: false,
            disableClose: true,
            width: '70%',
        });
        this.dialogRef.afterClosed()
            .subscribe(updatedconfirmedqty => {
            });
    }
}
