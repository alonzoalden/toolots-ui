import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseOutboundService } from '../../warehouse-outbound.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';
import { FulfillmentLine } from 'app/shared/class/fulfillment';
import { Router } from '@angular/router';
import { UpdateConfirmedQtyDialogComponent } from '../dialogs/update-confirmed-qty/update-confirmed-qty.component';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'pick-fulfillment-actions',
    templateUrl: './pick-fulfillment-actions.component.html',
    styleUrls: ['./pick-fulfillment-actions.component.scss'],
    animations: fuseAnimations
})
export class PickFulfillmentActionsComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    selectedFulfillmentLine: FulfillmentLine;
    pickIncomplete: boolean;
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
            .subscribe(selected => {
                this.selected = selected;
                if (this.scrollContainerEl) {
                    this.scrollContainerEl.nativeElement.scrollTop = 0;
                }
                if (this.selected.FulfillmentLines) {
                    this.checkPickIncomplete();
                }
            });
        this.warehouseOutboundService.onFulfillmentLineSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selectedFulfillmentLine = selected;
                if (this.scrollContainerEl) {
                    this.scrollContainerEl.nativeElement.scrollTop = 0;
                }
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    checkPickIncomplete(): void {
        this.pickIncomplete = !!this.selected.FulfillmentLines.find(line => !line.IsPicked);
    }
    clearSelected(): void {
        this.warehouseOutboundService.onFulfillmentSelected.next({});
        this.warehouseOutboundService.onFulfillmentLineSelected.next({});
        this.router.navigate(['warehouse/outbound']);
        // this._fuseSidebarService.getSidebar('outbound-details-sidebar').toggleOpen();
    }

    sendPick(fulfillmentline: FulfillmentLine): void {
        const newdata = new FulfillmentLine(this.selectedFulfillmentLine.FulfillmentLineID,
            this.selectedFulfillmentLine.ItemID, this.selectedFulfillmentLine.ItemImagePath,
            this.selectedFulfillmentLine.ItemTPIN, this.selectedFulfillmentLine.ItemSKU,
            this.selectedFulfillmentLine.Quantity, this.selectedFulfillmentLine.IsNotFound,
            this.selectedFulfillmentLine.IsPicked, this.selectedFulfillmentLine.ConfirmedBy,
            this.selectedFulfillmentLine.ConfirmedOn,
            this.selectedFulfillmentLine.FulfillmentLineInventoryDetails,
            this.selectedFulfillmentLine.FulfillmentLineConfirms, this.selectedFulfillmentLine.confirmedQty
        );
        newdata.IsPicked = !newdata.IsPicked;
        this.warehouseOutboundService.setPickedBasedOffQty(newdata);
        this.warehouseOutboundService.setMissing(newdata);
        this.warehouseOutboundService.copyInventoryDetailsIntoConfirms(newdata);
        this.warehouseOutboundService.updatePickFulfillmentLine(newdata)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.selectedFulfillmentLine.IsPicked = data.IsPicked;
                this.selectedFulfillmentLine.IsNotFound = data.IsNotFound;
                this.selectedFulfillmentLine.FulfillmentLineConfirms = data.FulfillmentLineConfirms;
                this.warehouseOutboundService.setTotalConfirmedQty(this.selectedFulfillmentLine);
                this.checkPickIncomplete();
                // if (data.picked) {
                //     this._service.success('Success', `${fulfillmentline.ItemTPIN} successfully picked`, {timeOut: 3000, clickToClose: true});
                // }
            });
    }
    sendMissingItem(fulfillmentline: FulfillmentLine): void {
        if (this.selectedFulfillmentLine.confirmedQty === this.selectedFulfillmentLine.Quantity) {
            this._service.error('Warning', `${fulfillmentline.ItemTPIN} has already been confirmed`, {timeOut: 3000, clickToClose: true});
            return;
        }

        const newdata = new FulfillmentLine(this.selectedFulfillmentLine.FulfillmentLineID,
            this.selectedFulfillmentLine.ItemID, this.selectedFulfillmentLine.ItemImagePath,
            this.selectedFulfillmentLine.ItemTPIN, this.selectedFulfillmentLine.ItemSKU,
            this.selectedFulfillmentLine.Quantity, this.selectedFulfillmentLine.IsNotFound,
            this.selectedFulfillmentLine.IsPicked, this.selectedFulfillmentLine.ConfirmedBy,
            this.selectedFulfillmentLine.ConfirmedOn,
            this.selectedFulfillmentLine.FulfillmentLineInventoryDetails,
            this.selectedFulfillmentLine.FulfillmentLineConfirms, null
        );
        newdata.IsNotFound = !newdata.IsNotFound;
        this.warehouseOutboundService.setPicked(newdata);
        this.warehouseOutboundService.updatePickFulfillmentLine(newdata)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.selectedFulfillmentLine.IsNotFound = data.IsNotFound;
                this.selectedFulfillmentLine.IsPicked = data.IsPicked;
                this.checkPickIncomplete();
            });
    }

    openDialogEnterConfirmedQty() {
        this.warehouseOutboundService.onPickInputEnabled.next(false);
        this.dialogRef = this._matDialog.open(UpdateConfirmedQtyDialogComponent, {
            panelClass: 'edit-dimensions-dialog',
            autoFocus: false,
            disableClose: true,
            width: '70%',
        });
        this.dialogRef.afterClosed()
            .subscribe(updatedconfirmedqty => {
                this.warehouseOutboundService.onPickInputEnabled.next(true);
                if (this.selectedFulfillmentLine.confirmedQty < this.selectedFulfillmentLine.Quantity) {
                    this.selectedFulfillmentLine.IsPicked = false;
                    this._service.error('Warning',
                        `${this.selectedFulfillmentLine.ItemTPIN} pick set to no`,
                        {timeOut: 3000, clickToClose: true});
                }
                // if (!response) {
                //     return;
                // }
                // this._snackBar.openFromComponent(SnackbarComponent, {
                //     data: { type: 'success', message: `Quantity Updated` },
                // });
            });
    }
}
