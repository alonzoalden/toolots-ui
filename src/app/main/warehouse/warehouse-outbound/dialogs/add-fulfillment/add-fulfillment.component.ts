import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseOutboundService } from '../../warehouse-outbound.service';
import { Fulfillment } from 'app/shared/class/fulfillment';
declare const dymo: any;

@Component({
    templateUrl: './add-fulfillment.component.html',
    styleUrls: ['./add-fulfillment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFulfillmentDialogComponent implements OnInit, OnDestroy {
    showExtraToFields: boolean;
    shippingType: string;
    isLoading: boolean;
    composeForm: FormGroup;
    shippingTypes = [
        'Will Call',
        'LTL',
        'Parcel - UPS',
    ];
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddFulfillmentDialogComponent>,
        private warehouseOutboundService: WarehouseOutboundService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.composeForm = this.createProductForm();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onSelect() {
        this.isLoading = true;
        const pickUpData = {
            FulfillmentNumber: this.composeForm.value.FulfillmentNumber,
            PickedUpBy: this.composeForm.value.PickedUpBy,
            ShippingMethod: this.composeForm.value.ShippingMethod,
        };
        this.warehouseOutboundService.pickUpButtonFulfillment(pickUpData)
            .subscribe(
                data => {
                    console.log(data);
                    this.isLoading = false;
                    return this.matDialogRef.close(data);
                },
                err => {
                    this.isLoading = false;
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        data: { type: 'error', message: `${err}` }
                    });
                }
            );
    }

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ShippingMethod: [this.data, Validators.required],
            FulfillmentNumber: ['', Validators.required],
            PickedUpBy: '',
        });
    }

    // validateFulfillment() {
    //     return this.composeForm.value.ShippingType.includes('IF');
    // }
}
