import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { WarehouseItemManagerService } from '../../warehouse-item-manager.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-manager/dialogs/edit-dimensions/edit-dimensions.component';
import { ItemList, ItemCartonInformation } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { CartonInformationDialogComponent } from '../../dialogs/carton-information/carton-information.component';
import { InventoryDetailDialogComponent } from '../../dialogs/inventory-detail/inventory-detail.component';
import { PotentialLocationDialogComponent } from '../../dialogs/potential-location/potential-location.component';

@Component({
    selector: 'item-manager-details-sidebar',
    templateUrl: './item-manager-details.component.html',
    styleUrls: ['./item-manager-details.component.scss'],
    animations: fuseAnimations
})
export class WarehouseItemManagerDetailsSidebarComponent implements OnInit, OnDestroy {
    selected: any;
    isEdit: boolean;
    dialogRef: any;
    units: any;
    weightUnits: any;
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    displayedColumns1 = ['PONumber', 'ContainerNumber', 'InboundShipmentNumber', 'CartonNumber', 'Quantity'];
    dataSource1: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
    constructor(
        private _fileManagerService: WarehouseItemManagerService,
        private router: Router,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _fuseSidebarService: FuseSidebarService,
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
                if (this.selected.Data) {
                    this.dataSource1 = new MatTableDataSource<ItemCartonInformation>(this.selected.Data.ItemCartonInformations);
                }
            });
    }
    composeDialog(): void {
        this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
            panelClass: 'edit-dimensions-dialog'
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

    composeDialogCartons(): void {
        this.dialogRef = this._matDialog.open(CartonInformationDialogComponent, {
            panelClass: 'view-list-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
    composeDialogInventoryDetails(): void {
        this.dialogRef = this._matDialog.open(InventoryDetailDialogComponent, {
            panelClass: 'view-list-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
    composeDialogPotentialLocations(): void {
        this.dialogRef = this._matDialog.open(PotentialLocationDialogComponent, {
            panelClass: 'view-list-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeSidebar(): void {
        this._fuseSidebarService.getSidebar('file-manager-details-sidebar').toggleOpen();
    }
}
