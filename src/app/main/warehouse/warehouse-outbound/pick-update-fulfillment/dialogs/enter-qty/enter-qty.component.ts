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
    templateUrl: './enter-qty.component.html',
    styleUrls: ['./enter-qty.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EnterQtyDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    composeForm: FormGroup;
    isLoading: boolean;
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
        public matDialogRef: MatDialogRef<EnterQtyDialogComponent>,
        private warehouseOutboundService: WarehouseOutboundService,
        private _snackBar: MatSnackBar,
        // private notificationComponent: NotificationComponent,
        @Inject(MAT_DIALOG_DATA) public data: number,
        private notificationsService: NotificationsService,
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
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            Quantity: [0, [Validators.required, Validators.max(this.data + 1)]]
        });
    }
    setMax() {
        if (this.composeForm.value.Quantity > this.data) {
            this.composeForm.value.Quantity = this.data;
        }
    }
    onSelect() {
        if (this.composeForm.value.Quantity > this.data) {
            return this._service.error('Error', 'Can not be greater than ordered quantity', {timeOut: 3000, clickToClose: true});
        }
        else {
            this.matDialogRef.close(this.composeForm.value.Quantity);
        }
    }
}
