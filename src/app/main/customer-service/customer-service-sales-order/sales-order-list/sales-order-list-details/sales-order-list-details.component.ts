import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector: 'sales-order-list-details-sidebar',
    templateUrl: './sales-order-list-details.component.html',
    styleUrls: ['./sales-order-list-details.component.scss'],
    animations: fuseAnimations
})
export class CustomerServiceSalesOrderListDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    @ViewChild('scrollContainer') scrollContainerEl: ElementRef;
    private _unsubscribeAll: Subject<any>;
    constructor(
        // public warehouseOutboundService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // this.warehouseOutboundService.onFulfillmentSelected
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(selected => {
        //         this.selected = selected;
        //         if (this.scrollContainerEl) {
        //             this.scrollContainerEl.nativeElement.scrollTop = 0;
        //         }
        //     });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    clearSelected(): void {
        // this.warehouseOutboundService.onFulfillmentSelected.next({});
        // this._fuseSidebarService.getSidebar('outbound-details-sidebar').toggleOpen();
    }
    goToAction(action: string) {
        let str = '';
        action.toLowerCase().split('').forEach(letter => {
            if (letter !== ' ') {
                str += letter;
            }
        });
        return str;
    }
}
