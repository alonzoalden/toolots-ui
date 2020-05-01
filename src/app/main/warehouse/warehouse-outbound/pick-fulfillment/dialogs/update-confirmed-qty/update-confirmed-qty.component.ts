import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ElementRef
    , ViewChild, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm, FulfillmentLineInventoryDetail } from 'app/shared/class/fulfillment';
// import { NotificationComponent } from 'app/shared/components/notification/notification.component';
import { NotificationsService } from 'angular2-notifications';
import { MatButton } from '@angular/material/button';
import { environment } from 'environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatInput } from '@angular/material/input';

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
    locationBinList: any;
    editConfirmQuantity: boolean;
    tempQuantity: number;
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: NgSelectComponent;
    @ViewChild('quantity', { static: false }) quantityInput: ElementRef;
    @ViewChildren(MatInput) matInputs: QueryList<MatInput>;
    private _unsubscribeAll: Subject<any>;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.onDialogClose();
        }
    }

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
        this.inputEnabled = true;
        this.editConfirmQuantity = false;
        this._unsubscribeAll = new Subject();
        this.selectedFulfillmentLine = new FulfillmentLine(null, null, null, null, null, null, null, null, null, null, null, [], [], null);
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
                // this.focusMainInput();

            });
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentlineconfirm => {
                this.selectedFulfillmentLineConfirm = fulfillmentlineconfirm;
            });
        this.warehouseOutboundService.locationBinList
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(binlist => {
                this.locationBinList = binlist;
            });
        this.warehouseOutboundService.editConfirmQuantity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(editquantity => {
                this.editConfirmQuantity = editquantity;
                if (editquantity) {
                    this.tempQuantity = this.selectedFulfillmentLineConfirm.Quantity || 0;
                    setTimeout(() => {
                        document.getElementById(this.selectedFulfillmentLineConfirm.BinNumber).focus();
                    });
                }
            });
    }
    ngAfterViewInit(): void {
        this.focusMainInput();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onSelect(fulfillmentlineconfirm: FulfillmentLineConfirm): void {
        if (this.selectedFulfillmentLineConfirm === fulfillmentlineconfirm) {
            return;
        }
        this.searchTerm = null;
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected.next(fulfillmentlineconfirm);
        this.tempQuantity = fulfillmentlineconfirm.Quantity;
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
        // this.searchTerm = '';
    }

    applySearch(searchValue: string) {
        if (!searchValue) {
            return;
        }
        if (this.currentSnackBar) {
            this.currentSnackBar.dismiss();
        }
        const defaultQty = this.selectedFulfillmentLine.Quantity > this.totalConfirmedQuantity()
            ? 1
            : 0;
        this.dataSource.data.push(new FulfillmentLineInventoryDetail(this.searchTerm, defaultQty));
        this.dataSource.data = this.dataSource.data;
        this.searchTerm = null;
        this.onSelect(this.dataSource.data[this.dataSource.data.length - 1]);
        this.focusMainInput();
    }
    focusMainInput() {
        if (!this.editConfirmQuantity) {
            setTimeout(() => {
                this.mainInput.focus();
            }, 10);
        }
    }
    onDialogClose() {
        this.warehouseOutboundService.editConfirmQuantity.next(false);
        const updatedConfirmedQuantity = this.dataSource.data
            .reduce((total, val: FulfillmentLineConfirm) => total = total + val.Quantity, 0);
        this.selectedFulfillmentLine.confirmedQty = updatedConfirmedQuantity;
        const filteredConfirms = this.selectedFulfillmentLine.FulfillmentLineConfirms.filter(bin => bin.Quantity);
        this.selectedFulfillmentLine.FulfillmentLineConfirms = filteredConfirms;
        this.matDialogRef.close(updatedConfirmedQuantity);
    }
    removeBin(row) {
        const index = this.selectedFulfillmentLine.FulfillmentLineConfirms.findIndex(item => item.BinNumber === row.BinNumber);
        this.selectedFulfillmentLine.FulfillmentLineConfirms.splice(index, 1);
        this.dataSource.data = this.selectedFulfillmentLine.FulfillmentLineConfirms;
    }
    onCheck(event) {
        console.log(event);
    }
    totalConfirmedQuantity(): number {
        return this.selectedFulfillmentLine.FulfillmentLineConfirms.reduce((total, val) => {
            return total += val.Quantity;
        }, 0);
    }
    getMaxPerRow(index): number {
        const totalConfirmsMinusIndex = this.selectedFulfillmentLine.FulfillmentLineConfirms
            .reduce((total, val, i) => {
                if (i !== index) {
                    return total + val.Quantity;
                }
                else {
                    return total;
                }
            }, 0);
        return this.selectedFulfillmentLine.Quantity - totalConfirmsMinusIndex;
    }
    keyuptest(event: any, index: number) {
        // const maxLimit = this.getMaxPerRow(index);
        // if (event.target.value > maxLimit) {
        //     event.target.value = maxLimit;
        // }
    }
    submitEnterQty(row: FulfillmentLineConfirm, index: number) {
        if (this.tempQuantity > this.getMaxPerRow(index)) {
            return;
        }
        if (this.tempQuantity === null || this.tempQuantity === undefined) {
            return;
        }
        this.warehouseOutboundService.toggleEnterConfirmedQty();
        this.focusMainInput();
        row.Quantity = this.tempQuantity;
    }
    cancelEnterQty(row: FulfillmentLineConfirm) {
        this.warehouseOutboundService.toggleEnterConfirmedQty();
        this.tempQuantity = row.Quantity;
    }
}

