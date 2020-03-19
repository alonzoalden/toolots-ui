import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseItemUpdateService } from '../warehouse-item-update.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, ItemDimension } from 'app/shared/class/item';

@Component({
    selector: 'mail-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MailComposeDialogComponent implements OnInit, OnDestroy{
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selected: any;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<MailComposeDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private warehouseItemUpdateService: WarehouseItemUpdateService,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
        this.selected = new ItemList(null, null, null, null, null, null, null
            , new ItemDimension(null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null)
            );
        this.composeForm = this.createProductForm();
        this.showExtraToFields = false;
    }

    ngOnInit(): void {
        this.warehouseItemUpdateService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ItemID: [this.selected.ItemID],
            ItemName: [this.selected.ItemName],
            FOBPrice: [this.selected.FOBPrice],
            Description: [this.selected.Description],
            TPIN: [this.selected.TPIN],
            VendorSKU: [this.selected.VendorSKU],
            ImagePath: [this.selected.ImagePath],
            Length: [this.selected.Dimensions.Length],
            Width: [this.selected.Dimensions.Width],
            Height: [this.selected.Dimensions.Height],
            Weight: [this.selected.Dimensions.Weight],
            PackageLength: [this.selected.Dimensions.PackageLength],
            PackageWidth: [this.selected.Dimensions.PackageWidth],
            PackageHeight: [this.selected.Dimensions.PackageHeight],
            PackageWeight: [this.selected.Dimensions.PackageWeight],
            PackagingType: [this.selected.Dimensions.PackagingType],
            MaximumParcelUnit: [this.selected.Dimensions.MaximumParcelUnit],
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
}
