import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseOutboundService } from '../../../../warehouse-outbound.service';
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
    selector: 'update-confirmed-qty-actions',
    templateUrl: './update-confirmed-qty-actions.component.html',
    styleUrls: ['./update-confirmed-qty-actions.component.scss'],
    animations: fuseAnimations
})
export class UpdateConfirmedQtyActionsComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    selectedFulfillmentLine: FulfillmentLine;
    selectedFulfillmentLineConfirm: FulfillmentLineConfirm;
    pickIncomplete: boolean;
    inputEnabled: boolean;
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
        // this.warehouseOutboundService.onPickUpdateInputEnabled
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((inputenabled: boolean) => {
        //         this.inputEnabled = inputenabled;
        //     });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    clearSelected(): void {
        this.router.navigate(['warehouse/outbound/pick']);
    }
    addConfirmedQty() {
        if ((this.totalConfirmedQuantity() + 1) <= this.selectedFulfillmentLine.Quantity) {
            this.selectedFulfillmentLineConfirm.Quantity++;
        }
        else {
            this._service.error('Error', 'Quantity can not exceed ordered quantity', {timeOut: 3000, clickToClose: true});
        }
    }
    subtractConfirmedQty() {
        if ((this.selectedFulfillmentLineConfirm.Quantity - 1) >= 0) {
            this.selectedFulfillmentLineConfirm.Quantity--;
        }
    }
    totalConfirmedQuantity(): number {
        return this.selectedFulfillmentLine.FulfillmentLineConfirms.reduce((total, val) => {
            return total += val.Quantity;
        }, 0);
    }
    openDialogEnterQty() {
        // this.warehouseOutboundService.onPickUpdateInputEnabled.next(false);
        // this.dialogRef = this._matDialog.open(EnterQtyDialogComponent, {
        //     panelClass: 'edit-dimensions-dialog',
        //     data: this.totalConfirmedQuantity() - this.selectedFulfillmentLineConfirm.Quantity
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         this.warehouseOutboundService.onPickUpdateInputEnabled.next(true);
        //         if (!response) {
        //             return;
        //         }
        //         this._snackBar.openFromComponent(SnackbarComponent, {
        //             data: { type: 'success', message: `Confirmed Quantity updated.` },
        //         });
        //     });
    }
}
