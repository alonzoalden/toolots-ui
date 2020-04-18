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

@Component({
    selector: 'pick-fulfillment-details-sidebar',
    templateUrl: './pick-fulfillment-details.component.html',
    styleUrls: ['./pick-fulfillment-details.component.scss'],
    animations: fuseAnimations
})
export class PickFulfillmentDetailsSidebarComponent implements OnInit, OnDestroy {
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
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.warehouseOutboundService.onFulfillmentSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                console.log(selected);
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
            this.selectedFulfillmentLine.FulfillmentLineConfirms, null, null
        );
        newdata.IsPicked = !newdata.IsPicked;
        if (newdata.IsPicked && newdata.IsNotFound) {
            newdata.IsNotFound = false;
        }
        this.warehouseOutboundService.updatePickFulfillmentLine(newdata)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
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
            this.selectedFulfillmentLine.FulfillmentLineConfirms, null, null
        );
        newdata.IsNotFound = !newdata.IsNotFound;
        if (newdata.IsNotFound && newdata.IsPicked) {
            newdata.IsPicked = false;
        }
        this.warehouseOutboundService.updatePickFulfillmentLine(newdata)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.checkPickIncomplete();
            });
    }
}
