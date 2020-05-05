import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseOutboundService } from '../../../warehouse-outbound.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';
import { FulfillmentLine, FulfillmentLineConfirm, Fulfillment } from 'app/shared/class/fulfillment';
import { Router } from '@angular/router';
// import { EnterQtyDialogComponent } from '../dialogs/enter-qty/enter-qty.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'fulfillment-package-actions',
    templateUrl: './fulfillment-package-actions.component.html',
    styleUrls: ['./fulfillment-package-actions.component.scss'],
    animations: fuseAnimations
})
export class FulfillmentPackageActionsComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    selectedFulfillmentLine: FulfillmentLine;
    selectedFulfillmentLineConfirm: FulfillmentLineConfirm;
    selectedFulfillmentLinePackage: any;
    pickIncomplete: boolean;
    inputEnabled: boolean;
    editConfirmQuantity: boolean;
    @ViewChild('scrollContainer') scrollContainerEl: ElementRef;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private warehouseOutboundService: WarehouseOutboundService,
        public warehouseService: WarehouseService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private _service: NotificationsService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selected: Fulfillment) => {
                this.selected = selected;
            });
        this.warehouseOutboundService.onFulfillmentLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selectedfulfillmentline: FulfillmentLine) => {
                this.selectedFulfillmentLine = selectedfulfillmentline;
            });
        this.warehouseOutboundService.onFulfillmentLineConfirmSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((fulfillmentlineconfirm: FulfillmentLineConfirm) => {
                this.selectedFulfillmentLineConfirm = fulfillmentlineconfirm;
            });

        this.warehouseOutboundService.onFulfillmentLinePackageSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((fulfillmentlinepackage: any) => {
                this.selectedFulfillmentLinePackage = fulfillmentlinepackage;
            });
        this.warehouseOutboundService.editConfirmQuantity
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((editquantity: boolean) => {
                this.editConfirmQuantity = editquantity;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    clearSelected(): void {
        this.router.navigate(['warehouse/outbound/pick']);
    }
    addQty() {
        if (this.selectedFulfillmentLinePackage.Quantity < this.selectedFulfillmentLine.Quantity) {
            this.selectedFulfillmentLinePackage.Quantity++;
        }
        else {
            this._service.error('Error', 'Quantity can not exceed ordered quantity', {timeOut: 3000, clickToClose: true});
            return;
        }
    }
    subtractQty() {
        if (this.selectedFulfillmentLinePackage.Quantity > 0) {
            this.selectedFulfillmentLinePackage.Quantity--;
        }
    }
    enterConfirmQty() {
        this.warehouseOutboundService.toggleEnterConfirmedQty();
    }
}
