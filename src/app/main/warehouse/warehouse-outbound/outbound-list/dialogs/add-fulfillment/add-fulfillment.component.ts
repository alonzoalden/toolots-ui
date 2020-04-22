import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { Fulfillment } from 'app/shared/class/fulfillment';
// import { NotificationComponent } from 'app/shared/components/notification/notification.component';
import { NotificationsService } from 'angular2-notifications';
import { MatButton } from '@angular/material/button';

declare const dymo: any;

@Component({
    templateUrl: './add-fulfillment.component.html',
    styleUrls: ['./add-fulfillment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddFulfillmentDialogComponent implements OnInit, AfterViewInit, OnDestroy {
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
    @ViewChild('mainButton') mainButton: MatButton;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.composeForm.valid) {
            this.onSelect();
        }
        if (event.key === 'Escape') {
            this.matDialogRef.close();
        }
    }

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddFulfillmentDialogComponent>,
        private warehouseOutboundService: WarehouseOutboundService,
        private _snackBar: MatSnackBar,
        // private notificationComponent: NotificationComponent,
        @Inject(MAT_DIALOG_DATA) private data: {ShippingMethod, FulfillmentNumber},
        private _service: NotificationsService
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.composeForm = this.createProductForm();
    }
    ngAfterViewInit(): void {
        // this.mainButton.focus();
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
            ShippingMethod: this.composeForm.value.ShippingMethod,
        };
        this.warehouseOutboundService.addPickUpFulfillment(pickUpData)
            .subscribe(
                data => {
                    this.isLoading = false;
                    data.FulfillmentNumber = this.composeForm.value.FulfillmentNumber;
                    return this.matDialogRef.close(data);
                },
                err => {
                    this.isLoading = false;
                    // this._snackBar.openFromComponent(SnackbarComponent, {
                    //     data: { type: 'error', message: `${err}` }
                    // });
                    this._service.error('Error', err, {timeOut: 3000, clickToClose: true});
                }
            );
    }

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ShippingMethod: [this.data.ShippingMethod, Validators.required],
            FulfillmentNumber: [this.data.FulfillmentNumber, Validators.required],
            PickedUpBy: '',
        });
    }

    // validateFulfillment() {
    //     return this.composeForm.value.ShippingType.includes('IF');
    // }
}

