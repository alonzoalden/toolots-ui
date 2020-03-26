import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { WarehouseItemUpdateService } from '../warehouse-item-update.service';
import { ItemList } from 'app/shared/class/item';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-update/dialogs/compose.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/class/components/snackbar/snackbar.component';
import { CartonInformationDialogComponent } from '../dialogs/carton-information/carton-information.component';
import { InventoryDetailDialogComponent } from '../dialogs/inventory-detail/inventory-detail.component';
import { PotentialLocationDialogComponent } from '../dialogs/potential-location/potential-location.component';
declare const dymo: any;
@Component({
    selector: 'file-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseItemUpdateListComponent implements OnInit, OnDestroy {
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
        private warehouseItemUpdateService: WarehouseItemUpdateService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
        // Set the private defaults
        // this.dataSource = new MatTableDataSource<ItemList>([]);
        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
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

        this.warehouseItemUpdateService.getAllItemList()
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On select
     *
     * @param selected
     */
    onSelect(selected: ItemList): void {
        this.warehouseItemUpdateService.onFileSelected.next(selected);
        this.warehouseItemUpdateService.getItemDimension(selected.ItemID).subscribe();
        // .subscribe(item => this.selected.Dimensions.push(item));
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
    composeDialogCartons(): void {
        this.dialogRef = this._matDialog.open(CartonInformationDialogComponent, {
            panelClass: 'list-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
    composeDialogInventoryDetails(): void {
        this.dialogRef = this._matDialog.open(InventoryDetailDialogComponent, {
            panelClass: 'list-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }
    composeDialogPotentialLocations(): void {
        this.dialogRef = this._matDialog.open(PotentialLocationDialogComponent, {
            panelClass: 'list-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => { });
    }

    // prints the label
    onPrint() {
        const labelXml =
            '<?xml version="1.0" encoding="utf-8"?>\
                <DieCutLabel Version="8.0" Units="twips">\
                    <PaperOrientation>Landscape</PaperOrientation>\
                    <Id>Address</Id>\
                    <PaperName>30252 Address</PaperName>\
                    <DrawCommands/>\
                    <ObjectInfo>\
                        <TextObject>\
                            <Name>Text</Name>\
                            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
                            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
                            <LinkedObjectName></LinkedObjectName>\
                            <Rotation>Rotation0</Rotation>\
                            <IsMirrored>False</IsMirrored>\
                            <IsVariable>True</IsVariable>\
                            <HorizontalAlignment>Left</HorizontalAlignment>\
                            <VerticalAlignment>Middle</VerticalAlignment>\
                            <TextFitMode>ShrinkToFit</TextFitMode>\
                            <UseFullFontHeight>True</UseFullFontHeight>\
                            <Verticalized>False</Verticalized>\
                            <StyledText/>\
                        </TextObject>\
                        <Bounds X="332" Y="150" Width="4455" Height="1260" />\
                    </ObjectInfo>\
                </DieCutLabel>';
        const label = dymo.label.framework.openLabelXml(labelXml);

        // set label text
        label.setObjectText('Text', 'someVal');
        // select printer to print on
        // for simplicity sake just use the first LabelWriter printer
        const printers = dymo.label.framework.getPrinters();
        if (printers.length === 0) {
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 0,
                data: { type: 'error', message: `Error: 'No DYMO printers are installed. Install DYMO printers.'` },
            });
            console.log('No DYMO printers are installed. Install DYMO printers.');
        }

        let printerName = '';
        for (const printer of printers) {
            // const printer = printers[i];
            if (printer.printerType === 'LabelWriterPrinter') {
                printerName = printer.name;
                break;
            }
        }

        if (printerName === '') {
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 0,
                data: { type: 'error', message: `Error: 'No DYMO printers are installed. Install DYMO printers.'` },
            });
            console.log('No DYMO printers are installed. Install DYMO printers.');
        }

        // finally print the label
        label.print(printerName);
    }
}
