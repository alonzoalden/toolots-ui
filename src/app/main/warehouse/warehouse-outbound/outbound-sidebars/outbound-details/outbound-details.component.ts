import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseOutboundService } from '../../warehouse-outbound.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector: 'outbound-details-sidebar',
    templateUrl: './outbound-details.component.html',
    styleUrls: ['./outbound-details.component.scss'],
    animations: fuseAnimations
})
export class WarehouseOutboundDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    units: any;
    weightUnits: any;
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    @ViewChild('scrollContainer') scrollContainerEl: ElementRef;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
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
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    clearSelected(): void {
        this.warehouseOutboundService.onFulfillmentSelected.next({});
        // this._fuseSidebarService.getSidebar('outbound-details-sidebar').toggleOpen();
    }
}
