import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceService } from './customer-service.service';

@Component({
    selector: 'app-customer-service',
    templateUrl: './customer-service.component.html',
    styleUrls: ['./customer-service.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CustomerServiceComponent implements OnInit, OnDestroy {
    selected: any;
    pathArr: string[];
    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public _matDialog: MatDialog,
        private customerServiceService: CustomerServiceService,
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
