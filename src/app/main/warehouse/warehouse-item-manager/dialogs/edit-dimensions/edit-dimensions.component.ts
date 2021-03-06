import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseItemManagerService } from '../../warehouse-item-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';

@Component({
    selector: 'edit-dimensions-dialog',
    templateUrl: './edit-dimensions.component.html',
    styleUrls: ['./edit-dimensions.component.scss'],
})
export class MailComposeDialogComponent implements OnInit, OnDestroy{
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selected: ItemList;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;

    objectKeys = Object.keys;

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
        private warehouseItemManagerService: WarehouseItemManagerService,
        public warehouseService: WarehouseService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this.selected = new ItemList(null, null, null, null, null, null
            , new Item(null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, [], [], [])
            );
        this.composeForm = this.createProductForm();

    }

    ngOnInit(): void {
        this.warehouseItemManagerService.onItemSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                if (selected.Data) {
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
            ItemID: [this.selected.ItemID],
            ItemName: [this.selected.ItemName],
            Description: [this.selected.Description],
            TPIN: [this.selected.TPIN],
            VendorSKU: [this.selected.VendorSKU],
            ImagePath: [this.selected.ImagePath],
            Length: [this.selected.Data.Length],
            Width: [this.selected.Data.Width],
            Height: [this.selected.Data.Height],
            Weight: [this.selected.Data.Weight],
            PackageLength: [this.selected.Data.PackageLength],
            PackageWidth: [this.selected.Data.PackageWidth],
            PackageHeight: [this.selected.Data.PackageHeight],
            PackageWeight: [this.selected.Data.PackageWeight],
            PackagingType: [this.selected.Data.PackagingType],
            PackageDimensionUOM: [this.selected.Data.PackageDimensionUOM],
            PackageWeightUOM: [this.selected.Data.PackageWeightUOM],
            ProductDimensionUOM: [this.selected.Data.ProductDimensionUOM],
            ProductWeightUOM: [this.selected.Data.ProductWeightUOM],
            MaximumParcelUnit: [this.selected.Data.MaximumParcelUnit],
        });
    }

    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    save(): void {
        this.isSaving = true;
        this.warehouseItemManagerService.editItemDimension(this.composeForm.value)
            .subscribe(
                data => {
                    this.selected.Data = data;
                    this.warehouseItemManagerService.onItemSelected.next(this.selected);
                    this.matDialogRef.close(this.selected);
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
}
