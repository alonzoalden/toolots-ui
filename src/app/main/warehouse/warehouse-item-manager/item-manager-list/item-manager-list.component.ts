import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseItemManagerService } from '../warehouse-item-manager.service';
import { ItemList } from 'app/shared/class/item';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-manager/dialogs/edit-dimensions/edit-dimensions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { CartonInformationDialogComponent } from '../dialogs/carton-information/carton-information.component';
import { InventoryDetailDialogComponent } from '../dialogs/inventory-detail/inventory-detail.component';
import { PotentialLocationDialogComponent } from '../dialogs/potential-location/potential-location.component';
import { PrintLabelDialogComponent } from '../dialogs/print-label/print-label.component';

@Component({
    selector: 'item-manager-list',
    templateUrl: './item-manager-list.component.html',
    styleUrls: ['./item-manager-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseItemManagerListComponent implements OnInit, OnDestroy {
    fileURL = environment.fileURL;
    files: any;
    dataSource: any;
    displayedColumns = ['Actions', 'ImagePath', 'ItemName', 'TPIN', 'VendorSKU', 'detail-button'];
    selected: any;
    isLoading: boolean;
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    dialogRef: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private warehouseItemManagerService: WarehouseItemManagerService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // this.warehouseItemManagerService.onItemSelected.next({});
        // this.warehouseItemManagerService.onFilesChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(files => {
        //         this.files = files;
        //     });

        this.warehouseItemManagerService.onItemSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
        this.isLoading = true;

        this.warehouseItemManagerService.allItemList
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(items => {
                if (items.length) {
                    this.dataSource = new MatTableDataSource<ItemList>(items);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                    this.isLoading = false;
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelect(selected: ItemList): void {
        this.warehouseItemManagerService.onItemSelected.next(selected);
        this.warehouseItemManagerService.getItemDimension(selected.ItemID).subscribe();
        // .subscribe(item => this.selected.Dimensions.push(item));
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
        this.toggleSearch();
        this.searchTerm = '';
        this.filterBySearchTerm();
    }

    filterBySearchTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if (searchTerm === '') {
            this.filteredCourses = this.dataSource.data;
        }
        else {
            this.filteredCourses = this.dataSource.data.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.warehouseItemManagerService.onItemSelected.next({});
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
    composeDialogPrintLabel(): void {
        this.dialogRef = this._matDialog.open(PrintLabelDialogComponent, {
            panelClass: 'edit-dimensions-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
}
