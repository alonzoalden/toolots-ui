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
                this.checkPickIncomplete();
            });
    }
    sendMissingItem(fulfillmentline: FulfillmentLine): void {
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
                this.checkPickIncomplete();
            });
    }

    openDialogEnterConfirmedQty() {
        this.warehouseOutboundService.onPickInputEnabled.next(false);
        this.dialogRef = this._matDialog.open(UpdateConfirmedQtyDialogComponent, {
            panelClass: 'edit-dimensions-dialog',
            width: '90%',
        });
        this.dialogRef.afterClosed()
            .subscribe(updatedconfirmedqty => {
                this.warehouseOutboundService.onPickInputEnabled.next(true);
                this.warehouseOutboundService.setPickedBasedOffQty(this.selectedFulfillmentLine);
                // if (!response) {
                //     return;
                // }
                // this._snackBar.openFromComponent(SnackbarComponent, {
                //     data: { type: 'success', message: `Confirmed Quantity updated.` },
                // });
            });
    }
}
