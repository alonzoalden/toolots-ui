import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerServiceService } from 'app/main/customer-service/customer-service.service';
import { SalesOrder } from 'app/shared/class/sales-order';
import { FulfillmentLine, Fulfillment } from 'app/shared/class/fulfillment';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';

@Component({
    selector: 'fulfillment-information',
    templateUrl: './fulfillment-information.component.html',
    styleUrls: ['./fulfillment-information.component.scss'],
    animations: fuseAnimations
})
export class FulfillmentInformationDialogComponent implements OnInit, OnDestroy{
    fileURL = environment.fileURL;
    showExtraToFields: boolean;
    selectedSalesOrder: SalesOrder;
    selectedFulfillment: Fulfillment;
    selectedFulfillmentLine: FulfillmentLine;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;
    displayedColumnsFulfillments = ['FulfillmentNumber', 'TransactionDate', 'ShippingMethod', 'ShippedOn', 'HasMissingItem'];
    displayedColumnsFulfillmentLines = ['ItemImagePath', 'ItemTPIN', 'ItemSKU', 'Quantity'];
    dataSourceFulfillments: any;
    dataSourceFulfillmentLines: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        public matDialogRef: MatDialogRef<FulfillmentInformationDialogComponent>,
        private csService: CustomerServiceService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
        this.selectedSalesOrder = new SalesOrder(
            null, null, null, null, null, null, [], [], null, null
        );
        // this.selectedFulfillment = new Fulfillment(
        //     null, null, null, null, null, null, null, null,
        //     null, null, null, null, null, null, null, null, null, [], []
        // );

    }

    ngOnInit(): void {
        this.csService.onSalesOrderSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selected: SalesOrder) => {
                this.selectedSalesOrder = selected;
                if (this.selectedSalesOrder.Fulfillments) {
                    this.dataSourceFulfillments = new MatTableDataSource<Fulfillment>(selected.Fulfillments);
                    this.dataSourceFulfillments.sort = this.sort;
                    this.dataSourceFulfillments.paginator = this.paginator;
                }
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onFulfillmentSelect(): void {
    }

    onSelect(row: Fulfillment): void {
        this.selectedFulfillment = row;
        this.dataSourceFulfillmentLines = new MatTableDataSource<FulfillmentLine>(this.selectedFulfillment.FulfillmentLines);
        this.dataSourceFulfillmentLines.sort = this.sort;
        this.dataSourceFulfillmentLines.paginator = this.paginator;
    }
    onSelectFulfillmentLine(row: FulfillmentLine): void {
        this.selectedFulfillmentLine = row;
    }
    close(): void {
        this.matDialogRef.close();
    }
}
