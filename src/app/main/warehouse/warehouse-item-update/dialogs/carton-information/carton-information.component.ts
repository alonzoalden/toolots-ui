import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseItemUpdateService } from '../../warehouse-item-update.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/class/components/snackbar/snackbar.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'carton-information',
    templateUrl: './carton-information.component.html',
    styleUrls: ['./carton-information.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CartonInformationDialogComponent implements OnInit, OnDestroy{
    showExtraToFields: boolean;
    selected: ItemList;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;
    displayedColumns = ['PONumber', 'ContainerNumber', 'InboundShipmentNumber', 'CartonNumber', 'Quantity'];
    dataSource: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    objectKeys = Object.keys;
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    units = [
        'IN',
        'CM'
    ];
    weightUnits = [
        'LB',
        'KG'
    ];

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<CartonInformationDialogComponent>,
        private warehouseItemUpdateService: WarehouseItemUpdateService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
        this.selected = new ItemList(null, null, null, null, null, null, null
            , new Item(null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, [], [], [])
            );

    }

    ngOnInit(): void {
        this.warehouseItemUpdateService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                if (selected.Data) {
                    this.dataSource = new MatTableDataSource<ItemList>(selected.Data.ItemCartonInformations);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                    // this.composeForm = this.createProductForm();
                }
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }

    close(): void {
        this.matDialogRef.close();
    }
}
