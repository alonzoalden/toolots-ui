import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseItemManagerService } from '../../warehouse-item-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'potential-location',
    templateUrl: './potential-location.component.html',
    styleUrls: ['./potential-location.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PotentialLocationDialogComponent implements OnInit, OnDestroy {
    showExtraToFields: boolean;
    selected: ItemList;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;
    displayedColumns = ['LocationName', 'BinNumber', 'LocationDate', 'SearchMethod'];
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
        public matDialogRef: MatDialogRef<PotentialLocationDialogComponent>,
        private warehouseItemManagerService: WarehouseItemManagerService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
        this.selected = new ItemList(null, null, null, null, null, null
            , new Item(null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, [], [], [])
            );

    }

    ngOnInit(): void {
        this.warehouseItemManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                if (selected.Data) {
                    this.dataSource = new MatTableDataSource<ItemList>(selected.Data.ItemPotentialLocations);
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
