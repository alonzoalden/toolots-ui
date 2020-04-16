import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseOutboundService } from '../../warehouse-outbound.service';

@Component({
    templateUrl: './select-shipping-type.component.html',
    styleUrls: ['./select-shipping-type.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectShippingTypeDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    showExtraToFields: boolean;
    shippingType: string;
    isLoading: boolean;
    shippingTypes = [
        'Will Call',
        'LTL',
        'Parcel - UPS',
    ];
    private _unsubscribeAll: Subject<any>;
    @ViewChild('shippingTypesRadio') shippingTypesRadio: ElementRef;

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<SelectShippingTypeDialogComponent>,
        private warehouseOutboundService: WarehouseOutboundService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.shippingType = 'Will Call';
    }
    ngAfterViewInit(): void {
        this.shippingTypesRadio.nativeElement.children[0].focus();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onSelect() {
        return this.matDialogRef.close(this.shippingType);
    }

}
