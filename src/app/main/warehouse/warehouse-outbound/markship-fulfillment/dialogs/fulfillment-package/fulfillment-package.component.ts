import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ElementRef
    , ViewChild, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fulfillment, FulfillmentLine, FulfillmentLineConfirm, FulfillmentLineInventoryDetail } from 'app/shared/class/fulfillment';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatInput } from '@angular/material/input';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { FormGroup, FormBuilder } from '@angular/forms';

declare const dymo: any;

@Component({
    templateUrl: './fulfillment-package.component.html',
    styleUrls: ['./fulfillment-package.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FulfillmentPackageDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    fileURL = environment.fileURL;
    dataSource: any;
    displayedColumns = ['TPIN', 'VendorSKU', 'Quantity'];
    isLoading: boolean;
    searchTerm: string;
    selected: Fulfillment;
    selectedFulfillmentLine: FulfillmentLine;
    selectedFulfillmentLineConfirm: FulfillmentLineConfirm;
    selectedFulfillmentLinePackage: any;
    editConfirmQuantity: boolean;
    tempQuantity: number;
    editDimensionsPage: boolean;
    composeForm: FormGroup;
    shippingMethods = ['Best Rate', 'Small Parcel', 'LTL'];
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('mainInput') mainInput: NgSelectComponent;
    @ViewChild('quantity', { static: false }) quantityInput: ElementRef;
    @ViewChildren(MatInput) matInputs: QueryList<MatInput>;
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.onDialogClose();
        }
    }
    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<FulfillmentPackageDialogComponent>,
        public warehouseOutboundService: WarehouseOutboundService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _service: NotificationsService
    ) {
        this.editConfirmQuantity = false;
        this.editDimensionsPage = false;
        this._unsubscribeAll = new Subject();
        this.selectedFulfillmentLine = new FulfillmentLine(null, null, null,
            null, null, null, null, null, null, null, null, null, [], [], null);
        this.composeForm = this.createProductForm();
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.isLoading = false;
                this.selected = selected;
                const fulfillmentLineData = [];
                this.selected.FulfillmentLines.forEach(item => {
                    fulfillmentLineData.push({ItemTPIN: item.ItemTPIN, ItemSKU: item.ItemSKU, Quantity: item.Quantity});
                });
                this.dataSource = new MatTableDataSource<any>(fulfillmentLineData);
                this.dataSource.sort = this.sort;
                this.onSelect(this.dataSource.data[0]);
            });
        this.warehouseOutboundService.onFulfillmentLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentline => {
                this.selectedFulfillmentLine = fulfillmentline;

            });

        this.warehouseOutboundService.onFulfillmentLinePackageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentlinepackage => {
                this.selectedFulfillmentLinePackage = fulfillmentlinepackage;
            });

        this.warehouseOutboundService.onFulfillmentLineConfirmSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fulfillmentlineconfirm => {
                this.selectedFulfillmentLineConfirm = fulfillmentlineconfirm;
            });
        this.warehouseOutboundService.editConfirmQuantity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(editquantity => {
                this.editConfirmQuantity = editquantity;
                if (editquantity) {
                    this.tempQuantity = this.selectedFulfillmentLineConfirm.Quantity || null;
                    setTimeout(() => {
                        document.getElementById(this.selectedFulfillmentLinePackage.ItemTPIN).focus();
                    }, 10);
                } else {
                    this.focusMainInput();
                }
            });
    }
    ngAfterViewInit(): void {
        this.focusMainInput();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onSelect(fulfillmentlinepackage: any): void {
        if (this.selectedFulfillmentLinePackage === fulfillmentlinepackage) {
            return;
        }
        this.searchTerm = null;
        this.warehouseOutboundService.onFulfillmentLinePackageSelected.next(fulfillmentlinepackage);
        this.tempQuantity = fulfillmentlinepackage.Quantity;
    }

    applySearch(searchValue: any) {
        if (!searchValue) {
            return;
        }
        if (this.dataSource.data.find(item => searchValue.ItemTPIN === item.ItemTPIN)) {
            this._service.info('Please check', 'Item is already in list', {timeOut: 3000, clickToClose: true});
            this.searchTerm = null;
            return;
        }
        const obj = {
            ItemTPIN: this.selectedFulfillmentLine.ItemTPIN,
            ItemSKU: this.selectedFulfillmentLine.ItemSKU,
            Quantity: this.selectedFulfillmentLine.Quantity
        };
        this.dataSource.data.push(obj);
        this.dataSource.data = this.dataSource.data;
        this.searchTerm = null;
        this.onSelect(this.dataSource.data[this.dataSource.data.length - 1]);
        this.focusMainInput();
    }
    focusMainInput() {
        if (!this.editConfirmQuantity && this.mainInput) {
            setTimeout(() => {
                if (this.mainInput) {
                    this.mainInput.focus();
                }
            }, 10);
        }
    }
    onDialogClose() {
        this.warehouseOutboundService.editConfirmQuantity.next(false);
        this.matDialogRef.close(this.dataSource.data);
    }
    removeBin(row) {
        const index = this.selectedFulfillmentLine.FulfillmentLineConfirms.findIndex(item => item.BinNumber === row.BinNumber);
        this.selectedFulfillmentLine.FulfillmentLineConfirms.splice(index, 1);
        this.dataSource.data = this.selectedFulfillmentLine.FulfillmentLineConfirms;
    }
    submitEnterQty(row: FulfillmentLineConfirm, index: number) {
        if (this.tempQuantity > this.selectedFulfillmentLine.Quantity) {
            return this._service.error('Error', 'Can not be greater than ordered quantity', {timeOut: 3000, clickToClose: true});
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
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ShippingMethod: [null],
            Length: [null],
            Width: [null],
            Height: [null],
            Weight: [null],
            Value: [null],
        });
    }

}

