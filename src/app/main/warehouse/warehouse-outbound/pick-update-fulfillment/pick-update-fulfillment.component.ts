import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
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
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm } from 'app/shared/class/fulfillment';
import { WarehouseItemManagerService } from '../../warehouse-item-manager/warehouse-item-manager.service';
import { DOCUMENT } from '@angular/common';
import { SelectShippingTypeDialogComponent } from '../outbound-list/dialogs/select-shipping-type/select-shipping-type.component';
import { AddFulfillmentDialogComponent } from '../outbound-list/dialogs/add-fulfillment/add-fulfillment.component';
import { EnterQtyDialogComponent } from './dialogs/enter-qty/enter-qty.component';

@Component({
    selector: 'pick-update-fulfillment',
    templateUrl: './pick-update-fulfillment.component.html',
    styleUrls: ['./pick-update-fulfillment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PickUpdateFulfillmentComponent implements OnInit, AfterViewInit, OnDestroy {
    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    displayedColumns = ['BinNumber', 'Quantity'];
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
    selectedFulfillmentLine: FulfillmentLine;
    selectedFulfillmentLineConfirm: FulfillmentLineConfirm;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: ElementRef;

    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        public warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
        this.inputEnabled = true;
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.isLoading = false;
                this.selected = selected;
            });
        this.warehouseOutboundService.onFulfillmentLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentline => {
                this.selectedFulfillmentLine = fulfillmentline;
                this.dataSource = new MatTableDataSource<FulfillmentLineConfirm>(this.selectedFulfillmentLine.FulfillmentLineConfirms);
                this.dataSource.sort = this.sort;
                this.onSelect(this.dataSource.data[0]);
            });
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentlineconfirm => {
                this.selectedFulfillmentLineConfirm = fulfillmentlineconfirm;
            });
        // this.warehouseOutboundService.onPickInputEnabled
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(inputenabled => {
        //         this.inputEnabled = inputenabled;
        //     });
    }

    ngAfterViewInit() {
        this.focusMainInput();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // clearInterval(this.interval);
    }

    onSelect(fulfillmentlineconfirm: FulfillmentLineConfirm): void {
        this.searchTerm = '';
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected.next(fulfillmentlineconfirm);
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
            document.getElementById(foundFulfillment.FulfillmentID).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 10);

    }
    focusMainInput() {
        if (this.inputEnabled) {
            this.mainInput.nativeElement.focus();
        }
    }
}
