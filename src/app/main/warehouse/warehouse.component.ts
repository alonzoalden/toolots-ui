import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';
import { MatDialog } from '@angular/material/dialog';
import { WarehouseItemManagerService } from './warehouse-item-manager/warehouse-item-manager.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseComponent implements OnInit, OnDestroy {
    selected: any;
    pathArr: string[];
    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public _matDialog: MatDialog,
        private warehouseService: WarehouseService,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
