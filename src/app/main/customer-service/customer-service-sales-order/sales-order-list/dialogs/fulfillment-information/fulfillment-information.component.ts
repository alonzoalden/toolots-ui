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
import { FulfillmentLine, Fulfillment, FulfillmentShipmentTracking, FulfillmentImage } from 'app/shared/class/fulfillment';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';
import { WarehouseOutboundService } from 'app/main/warehouse/warehouse-outbound/warehouse-outbound.service';
import { Lightbox } from 'ngx-lightbox';

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
    selectedFulfillmentTracking: FulfillmentShipmentTracking;
    selectedFulfillmentImage: FulfillmentImage;
    private _unsubscribeAll: Subject<any>;
    isSaving: boolean;
    displayedColumnsFulfillments = ['FulfillmentNumber', 'TransactionDate',
        'ShippingMethod', 'PickedUp', 'Picked', 'Packed', 'Shipped',
        'HasMissingItem'];
    displayedColumnsFulfillmentLines = ['ItemImagePath', 'ItemName', 'ItemTPIN',
    'ItemSKU', 'Ordered', 'Confirmed'];
    displayedColumnsFulfillmentTrackings = ['TrackingNumber'];
    displayedColumnsFulfillmentImages = ['ImagePath'];
    dataSourceFulfillments: any;
    dataSourceFulfillmentLines: any;
    dataSourceFulfillmentTrackings: any;
    dataSourceFulfillmentImages: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        public matDialogRef: MatDialogRef<FulfillmentInformationDialogComponent>,
        private csService: CustomerServiceService,
        private warehouseOutboundService: WarehouseOutboundService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _lightbox: Lightbox
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
    onSelect(row: Fulfillment): void {
        this.selectedFulfillment = row;
        this.selectedFulfillment.FulfillmentLines.forEach((line: FulfillmentLine) => {
            this.warehouseOutboundService.setTotalConfirmedQty(line);
            // this.warehouseOutboundService.setPickedBasedOffQty(line);
        });
        this.dataSourceFulfillmentLines = new MatTableDataSource<FulfillmentLine>(this.selectedFulfillment.FulfillmentLines);
        this.selectedFulfillment.FulfillmentShipmentTrackings.push(new FulfillmentShipmentTracking(null, null, '1Z 999 AA1 01 2345 6784'));
        this.selectedFulfillment.FulfillmentShipmentTrackings.push(new FulfillmentShipmentTracking(null, null, '1Z 999 AA1 01 2345 6784'));
        this.selectedFulfillment.FulfillmentShipmentTrackings.push(new FulfillmentShipmentTracking(null, null, '1Z 999 AA1 01 2345 6784'));
        this.selectedFulfillment.FulfillmentShipmentTrackings.push(new FulfillmentShipmentTracking(null, null, '1Z 999 AA1 01 2345 6784'));
        this.dataSourceFulfillmentTrackings =
            new MatTableDataSource<FulfillmentShipmentTracking>(this.selectedFulfillment.FulfillmentShipmentTrackings);
        this.selectedFulfillment.FulfillmentImages
                // tslint:disable-next-line: max-line-length
                .push(new FulfillmentImage(null, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS8dQwqmZC1JFtoi0fCWbHGVNlHrLzjcx9acGyuHy-ctpZBxb2Oj2jcjnLo1C0ucrPdBcC5cI&usqp=CAc'));
        this.dataSourceFulfillmentImages = new MatTableDataSource<FulfillmentImage>(this.selectedFulfillment.FulfillmentImages);

    }
    onSelectFulfillmentLine(row: FulfillmentLine): void {
        this.selectedFulfillmentLine = row;
    }
    onSelectFulfillmentTracking(row: FulfillmentShipmentTracking): void {
        this.selectedFulfillmentTracking = row;
    }
    onSelectFulfillmentImage(row: FulfillmentImage): void {
        this.selectedFulfillmentImage = row;
    }
    openImageViewer(index: number): void {
        const photodata = this.dataSourceFulfillmentImages.data.map(image => {
            image.src = image.ImagePath;
            return image;
        });
        console.log(photodata);
        this._lightbox.open(photodata, index);
    }
    close(): void {
        this.matDialogRef.close();
    }
}
