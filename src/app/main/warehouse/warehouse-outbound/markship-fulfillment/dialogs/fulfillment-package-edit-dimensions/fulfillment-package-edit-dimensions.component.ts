import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { Fulfillment, FulfillmentLine } from 'app/shared/class/fulfillment';

@Component({
    selector: 'fulfillment-package-edit-dimensions-dialog',
    templateUrl: './fulfillment-package-edit-dimensions.component.html',
    styleUrls: ['./fulfillment-package-edit-dimensions.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FulfillmentPackageEditDimensionsDialogComponent implements OnInit, OnDestroy{
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selected: Fulfillment;
    selectedFulfillmentLine: FulfillmentLine;
    selectedFulfillmentPackage: any;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;

    objectKeys = Object.keys;
    shippingMethods = ['Best Rate', 'Small Parcel', 'LTL'];

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<FulfillmentPackageEditDimensionsDialogComponent>,
        private warehouseOutboundService: WarehouseOutboundService,
        public warehouseService: WarehouseService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this.selected = new Fulfillment(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, []);
        this.composeForm = this.createProductForm();
    }

    ngOnInit(): void {
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                // add quantities
            });
        this.selectedFulfillmentPackage = this._data;
        this.composeForm = this.createProductForm();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ShippingMethod: [this._data.ShippingMethod],
            Length: [this._data.Length],
            Width: [this._data.Width],
            Height: [this._data.Height],
            Weight: [this._data.Weight],
            Value: [this._data.Value],
        });
    }

    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    save(): void {
        // this.isSaving = true;
        // this.warehouseItemManagerService.editItemDimension(this.composeForm.value)
        //     .subscribe(
        //         data => {
        //             this.selected.Data = data;
        //             this.warehouseItemManagerService.onItemSelected.next(this.selected);
        //             this.matDialogRef.close(this.selected);
        //         },
        //         error => {
        //             this._snackBar.openFromComponent(SnackbarComponent, {
        //                 data: { type: 'error', message: error },
        //                 duration: 0,
        //             });
        //             this.isSaving = false;
        //         }
        //     );
    }
    onDialogClose() {
        this.matDialogRef.close(this.composeForm.value);
    }
}
