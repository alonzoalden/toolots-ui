import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { CustomerServiceService } from 'app/main/customer-service/customer-service.service';
import { SalesOrderEditAddressDialogComponent } from '../dialogs/sales-order-edit-address/sales-order-edit-address.component';
import { FulfillmentInformationDialogComponent } from '../dialogs/fulfillment-information/fulfillment-information.component';

@Component({
    selector: 'sales-order-list-details-sidebar',
    templateUrl: './sales-order-list-details.component.html',
    styleUrls: ['./sales-order-list-details.component.scss'],
    animations: fuseAnimations
})
export class CustomerServiceSalesOrderListDetailsSidebarComponent implements OnInit, OnDestroy {
    selectedSalesOrder: any;
    isEdit: boolean;
    dialogRef: any;
    @ViewChild('scrollContainer') scrollContainerEl: ElementRef;
    private _unsubscribeAll: Subject<any>;
    constructor(
        // public warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public salesOrderService: CustomerServiceService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.salesOrderService.onSalesOrderSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selectedSalesOrder = selected;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    clearSelected(): void {
        this.salesOrderService.onSalesOrderSelected.next({});
        // this._fuseSidebarService.getSidebar('outbound-details-sidebar').toggleOpen();
    }
    openDialogSalesOrderEditAddress(): void {
        // this.inputEnabled = false;
        this.dialogRef = this._matDialog.open(SalesOrderEditAddressDialogComponent, {
            panelClass: 'edit-dialog',
            autoFocus: false
        });
        this.dialogRef.afterClosed()
            .subscribe(shippingtype => {
            });
    }
    openDialogSalesOrderViewFulfillments(): void {
        // this.inputEnabled = false;
        this.dialogRef = this._matDialog.open(FulfillmentInformationDialogComponent, {
            panelClass: 'view-list-dialog',
            autoFocus: false,
            width: '84vw',
            height: '100%',
        });
        this.dialogRef.afterClosed()
            .subscribe(data => {
            });
    }
}
