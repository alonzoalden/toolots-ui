import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm } from 'app/shared/class/fulfillment';
// import { NotificationComponent } from 'app/shared/components/notification/notification.component';
import { NotificationsService } from 'angular2-notifications';
import { MatButton } from '@angular/material/button';
import { environment } from 'environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

declare const dymo: any;

@Component({
    templateUrl: './update-confirmed-qty.component.html',
    styleUrls: ['./update-confirmed-qty.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UpdateConfirmedQtyDialogComponent implements OnInit, AfterViewInit, OnDestroy {
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

    // @HostListener('document:keydown', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     if (event.key === 'Enter' && this.composeForm.valid) {
    //         this.onSelect();
    //     }
    //     if (event.key === 'Escape') {
    //         this.matDialogRef.close();
    //     }
    // }

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<UpdateConfirmedQtyDialogComponent>,
        public warehouseOutboundService: WarehouseOutboundService,
        private _snackBar: MatSnackBar,
        // private notificationComponent: NotificationComponent,
        @Inject(MAT_DIALOG_DATA) private data: {ShippingMethod, FulfillmentNumber},
        private _service: NotificationsService
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
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
    ngAfterViewInit(): void {
        // this.mainButton.focus();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onSelect(fulfillmentlineconfirm: FulfillmentLineConfirm): void {
        this.searchTerm = '';
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected.next(fulfillmentlineconfirm);
    }

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ShippingMethod: [this.data.ShippingMethod, Validators.required],
            FulfillmentNumber: [this.data.FulfillmentNumber, Validators.required],
            PickedUpBy: '',
        });
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
    onDialogClose() {
        const updatedConfirmedQuantity = this.dataSource.data
            .reduce((total, val: FulfillmentLineConfirm) => total = total + val.Quantity, 0);
        this.selectedFulfillmentLine.confirmedQty = updatedConfirmedQuantity;
        this.matDialogRef.close(updatedConfirmedQuantity);
    }
}

