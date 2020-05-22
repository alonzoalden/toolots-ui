import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { CustomerServiceService } from 'app/main/customer-service/customer-service.service';
import { SalesOrder } from 'app/shared/class/sales-order';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'sales-order-edit-address-dialog',
    templateUrl: './sales-order-edit-address.component.html',
    styleUrls: ['./sales-order-edit-address.component.scss'],
})
export class SalesOrderEditAddressDialogComponent implements OnInit, OnDestroy {
    composeForm: FormGroup;
    selected: SalesOrder;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;

    objectKeys = Object.keys;
    shippingMethods = ['Best Rate', 'Small Parcel', 'LTL'];

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<SalesOrderEditAddressDialogComponent>,
        private csService: CustomerServiceService,
        private _snackBar: MatSnackBar,
        private _service: NotificationsService,
        @Inject(MAT_DIALOG_DATA) public _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this.selected = new SalesOrder(
            null, null, null, null, null, null, [], [], null, null
        );
    }

    ngOnInit(): void {
        this.csService.onSalesOrderSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                if (this.selected.shippingAddress) {
                    this.composeForm = this.createProductForm();
                }
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            CompanyName: [this.selected.shippingAddress.CompanyName || null],
            FirstName: [this.selected.shippingAddress.FirstName || null],
            LastName: [this.selected.shippingAddress.LastName || null],
            Address1: [this.selected.shippingAddress.Address1 || null],
            Address2: [this.selected.shippingAddress.Address2 || null],
            City: [this.selected.shippingAddress.City || null],
            State: [this.selected.shippingAddress.State || null],
            PostalCode: [this.selected.shippingAddress.PostalCode || null],
            PhoneNumber: [this.selected.shippingAddress.PhoneNumber || null],
        });
    }
    onSave(): void {
        this.isSaving = true;
        this.csService.updateAddress(this.selected.ShippingAddressTransID, this.composeForm.value)
            .subscribe(
                data => {
                    this.selected.shippingAddress.CompanyName = data.CompanyName;
                    this.selected.shippingAddress.FirstName = data.FirstName;
                    this.selected.shippingAddress.LastName = data.LastName;
                    this.selected.shippingAddress.Address1 = data.AddressLine1;
                    this.selected.shippingAddress.Address2 = data.AddressLine2;
                    this.selected.shippingAddress.City = data.City;
                    this.selected.shippingAddress.State = data.State;
                    this.selected.shippingAddress.PostalCode = data.PostalCode;
                    this.selected.shippingAddress.PhoneNumber = data.PhoneNumber;

                    this.csService.onSalesOrderSelected.next(this.selected);
                    this.matDialogRef.close(this.selected);
                    this._service.success('Success', `Shipping Address updated.`, { timeOut: 3000, clickToClose: true });
                },
                error => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        data: { type: 'error', message: error },
                        duration: 0,
                    });
                    this.isSaving = false;
                }
            );
    }
    onDialogClose() {
        this.matDialogRef.close();
    }
}
