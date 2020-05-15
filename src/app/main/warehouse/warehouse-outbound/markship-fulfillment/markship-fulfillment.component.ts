import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
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
import { FulfillmentPackageDialogComponent } from './dialogs/fulfillment-package/fulfillment-package.component';
import {
    FulfillmentPackageEditDimensionsDialogComponent
} from './dialogs/fulfillment-package-edit-dimensions/fulfillment-package-edit-dimensions.component';
import {
    FulfillmentPackingSlipEditAddressDialogComponent
} from './dialogs/fulfillment-packing-slip-edit-address/fulfillment-packing-slip-edit-address.component';

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
    dataSourceItems: any;
    dataSourcePackingSlip: any;
    dataSourcePackage: any;
    displayedColumnsItem = ['Fulfillment', 'Item', 'BIN', 'ConfirmedBIN', 'OrderedQty', 'PackedQty', 'SelectedPackageQty'];
    displayedColumnsPackingSlip = ['Fulfillment', 'Address1', 'Address2', 'City', 'State', 'Zip'];
    displayedColumnsPackage = ['PackageNumber', 'Length', 'Width', 'Height', 'Weight', 'TrackingNumber'];
    fulfillmentLinePackingSlips: any[];
    fulfillmentLinePackages: any[];
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
    selectedFulfillmentPackage: any;
    selectedFulfillmentPackingSlip: any;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: ElementRef;
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
        this.fulfillmentLinePackingSlips = [];
        this.fulfillmentLinePackages = [];
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
                    if (!this.dataSourceItems) {
                        this.refreshDataSource();
                        if (!this.selectedFulfillmentLine) {
                            this.onSelect(this.dataSourceItems.data[0], 'item');
                        }
                    }
                }
            });
        // this.warehouseOutboundService.onFulfillmentLineSelected
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((selectedfulfillmentline: FulfillmentLine) => {
        //         this.selectedFulfillmentLine = selectedfulfillmentline;
        //     });
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
        this.dataSourceItems = new MatTableDataSource<FulfillmentLine>(this.selected.FulfillmentLines);
        this.dataSourceItems.sort = this.sort;

        this.dataSourcePackage = new MatTableDataSource<any>(this.fulfillmentLinePackages);
        // this.dataSourcePackage.sort = this.sort;

        this.dataSourcePackingSlip = new MatTableDataSource<any>(this.fulfillmentLinePackingSlips);
        // this.dataSourcePackage.sort = this.sort;
    }
    onSelect(fulfillmentline: any, type: string): void {
        this.searchTerm = '';
        if (type === 'item') {
            this.selectedFulfillmentLine = fulfillmentline;
            this.warehouseOutboundService.onFulfillmentLineSelected.next(fulfillmentline);
        }
        if (type === 'packingslip') {
            this.selectedFulfillmentPackingSlip = fulfillmentline;
            // this.warehouseOutboundService.onFulfillmentLineSelected.next(fulfillmentline);
        }
        if (type === 'package') {
            this.selectedFulfillmentPackage = fulfillmentline;
            // this.warehouseOutboundService.onFulfillmentLineSelected.next(fulfillmentline);
        }
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
        const foundFulfillment = this.dataSourceItems.data.find((fulfillmentline: FulfillmentLine) => {
            return (fulfillmentline.ItemTPIN.toLowerCase() === searchValue.toLowerCase()
                || fulfillmentline.ItemSKU.toLowerCase() === searchValue.toLowerCase());
        });

        if (!foundFulfillment) {
            this.currentSnackBar = this._snackBar.openFromComponent(SnackbarComponent, {
                data: { type: 'error', message: `Fulfillment Line not found.` }, duration: 2000
            });
            return this.warehouseOutboundService.clearSelected();
        }
        this.dataSourceItems.data = this.dataSourceItems.data;

        // set foundFulfillment to be selected
        this.warehouseOutboundService.onFulfillmentSelected.next(foundFulfillment);

        // timeout to make sure page loads then scroll item into view
        setTimeout(() => {
            document.getElementById(foundFulfillment.FulfillmentID).scrollIntoView({ block: 'center' });
        }, 10);
    }
    openDialogFulfillmentPackage(): void {
        this.warehouseOutboundService.onPickInputEnabled.next(false);
        const fulfillmentpackage = Object.assign({}, this.selectedFulfillmentPackage);
        this.dialogRef = this._matDialog.open(FulfillmentPackageDialogComponent, {
            panelClass: 'update-qty-dialog',
            autoFocus: false,
            disableClose: true,
            // width: '80%',
            data: fulfillmentpackage
        });
        this.dialogRef.afterClosed()
            .subscribe(packageitems => {
                if (packageitems) {
                    const newpackage = {
                        Length: null,
                        Width: null,
                        Heigth: null,
                        Weight: null,
                        Items: packageitems
                    };
                    this.fulfillmentLinePackages.push(newpackage);
                    this.refreshDataSource();
                    this.selectedFulfillmentPackage = this.dataSourcePackage.data[this.dataSourcePackage.data.length - 1];
                }
                // this.refreshDataSource();
            });
    }
    openDialogFulfillmentPackageEditDimensions(): void {
        this.warehouseOutboundService.onPickInputEnabled.next(false);
        if (!this.selectedFulfillmentPackage) {
            return;
        }
        this.dialogRef = this._matDialog.open(FulfillmentPackageEditDimensionsDialogComponent, {
            panelClass: 'edit-dialog',
            autoFocus: false,
            disableClose: true,
            width: '70%',
            data: this.selectedFulfillmentPackage,
        });
        this.dialogRef.afterClosed()
            .subscribe(packageinfo => {
                if (!packageinfo) {
                    return;
                }
                this.selectedFulfillmentPackage.Weight = packageinfo.Weight;
                this.selectedFulfillmentPackage.Height = packageinfo.Height;
                this.selectedFulfillmentPackage.Length = packageinfo.Length;
                this.selectedFulfillmentPackage.Width = packageinfo.Width;
                this.selectedFulfillmentPackage.PackageNumber = packageinfo.PackageNumber;
                this.selectedFulfillmentPackage.TrackingNumber = packageinfo.TrackingNumber;

            });
    }
    openDialogFulfillmentPackingSlipEditAddress(): void {
        const _data = {
            Address1: '4037 East Ave R-12',
            Address2: '',
            City: 'Palmdale',
            State: 'CA',
            Zip: '93551',
        };
        this.dialogRef = this._matDialog.open(FulfillmentPackingSlipEditAddressDialogComponent, {
            panelClass: 'edit-dialog',
            autoFocus: false,
            disableClose: true,
            data: _data,
        });
        this.dialogRef.afterClosed()
            .subscribe(updatedconfirmedqty => {
            });
    }
    onScroll(e) {
    }
}
