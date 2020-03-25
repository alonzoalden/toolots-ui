import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { WarehouseItemUpdateService } from '../../warehouse-item-update.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-update/dialogs/compose.component';
import { ItemList } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/class/components/snackbar/snackbar.component';

@Component({
    selector: 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    animations: fuseAnimations
})
export class WarehouseItemUpdateDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    units: any;
    weightUnits: any;
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
    constructor(
        private _fileManagerService: WarehouseItemUpdateService,
        private router: Router,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this.router.url.includes('/warehouse-item-update/edit/')) {
            this.isEdit = true;
        }
        this.router.events.subscribe(
            (event: any) => {
                if (event instanceof NavigationEnd) {
                    if (event.url.includes('/warehouse-item-update/edit/')) {
                        this.isEdit = true;
                    } else {
                        this.isEdit = false;
                    }
                }
            }
        );

        this._fileManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
    }
    composeDialog(): void {
        this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
            panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                this._snackBar.openFromComponent(SnackbarComponent, {
                    data: { type: 'success', message: `${response.TPIN} has been successfully updated.` },
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
