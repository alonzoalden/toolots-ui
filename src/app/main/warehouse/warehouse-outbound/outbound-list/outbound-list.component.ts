import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseOutboundService } from '../warehouse-outbound.service';
import { ItemList } from 'app/shared/class/item';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-manager/dialogs/edit-dimensions/edit-dimensions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import { Fulfillment } from 'app/shared/class/fulfillment';

@Component({
    selector: 'outbound-list',
    templateUrl: './outbound-list.component.html',
    styleUrls: ['./outbound-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseOutboundListComponent implements OnInit, OnDestroy {
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
        private warehouseItemUpdateService: WarehouseOutboundService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        this._unsubscribeAll = new Subject();
        this.searchTerm = '';
        this.searchEnabled = false;
    }

    ngOnInit(): void {

        this.warehouseItemUpdateService.onFileSelected.next({});
        this.warehouseItemUpdateService.onFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(files => {
                this.files = files;
            });

        this.warehouseItemUpdateService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
            });
        this.isLoading = true;

        this.warehouseItemUpdateService.getFulfillmentList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(items => {
                if (items.length) {
                    this.dataSource = new MatTableDataSource<ItemList>(items);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                }
                this.isLoading = false;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSelect(selected: Fulfillment): void {
        this.warehouseItemUpdateService.onFileSelected.next(selected);
        this.warehouseItemUpdateService.getFulfillment(selected.FulfillmentID).subscribe();
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
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

    /**
     * Filter courses by term
     */
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
        this.warehouseItemUpdateService.onFileSelected.next({});
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
}
