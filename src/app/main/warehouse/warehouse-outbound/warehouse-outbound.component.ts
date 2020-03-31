import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-manager/dialogs/edit-dimensions/edit-dimensions.component';
import { WarehouseOutboundService } from './warehouse-outbound.service';
import { Router } from '@angular/router';

@Component({
    selector: 'warehouse-outbound',
    templateUrl: './warehouse-outbound.component.html',
    styleUrls: ['./warehouse-outbound.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseOutboundComponent implements OnInit, OnDestroy {
    selected: any;
    pathArr: string[];
    dialogRef: any;
    isEdit: boolean;
    searchTerm: string;
    searchEnabled: boolean;
    filteredCourses: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public _matDialog: MatDialog,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void { }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onActivate(e, scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}
