import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseItemManagerService } from '../../warehouse-item-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ItemList, Item } from 'app/shared/class/item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
declare const dymo: any;

@Component({
    selector: 'print-label',
    templateUrl: './print-label.component.html',
    styleUrls: ['./print-label.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrintLabelDialogComponent implements OnInit, OnDestroy {
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selected: ItemList;
    private _unsubscribeAll: Subject<any>;
    isPrinting: boolean;
    printers: any[];

    objectKeys = Object.keys;
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    units = [
        'IN',
        'CM'
    ];
    weightUnits = [
        'LB',
        'KG'
    ];

    /**
     * Constructor
     *
     * @param {MatDialogRef<PrintLabelDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<PrintLabelDialogComponent>,
        private warehouseItemManagerService: WarehouseItemManagerService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        // Set the defaults
        this._unsubscribeAll = new Subject();
        this.selected = new ItemList(null, null, null, null, null, null
            , new Item(null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, [], [], [])
            );
        this.composeForm = this.createProductForm();
        this.printers = [];

    }

    ngOnInit(): void {
        this.printers = dymo.label.framework.getPrinters();

        this.warehouseItemManagerService.onItemSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                if (selected.Data) {
                    this.composeForm = this.createProductForm();
                }
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createProductForm(): FormGroup {
        return this._formBuilder.group({
            Printer: [this.selected.ItemID],
            Message: [this.selected.ItemName]
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void {
        this.showExtraToFields = !this.showExtraToFields;
    }
    print(): void {
    }
    // save(): void {
    //     this.isSaving = true;
    //     this.warehouseItemManagerService.editItemDimension(this.composeForm.value)
    //         .subscribe(
    //             data => {
    //                 this.selected.Data = data;
    //                 this.warehouseItemManagerService.onItemSelected.next(this.selected);
    //                 this.matDialogRef.close(this.selected);
    //             },
    //             error => {
    //                 this._snackBar.openFromComponent(SnackbarComponent, {
    //                     data: { type: 'error', message: error },
    //                     duration: 0,
    //                 });
    //                 this.isSaving = false;
    //             }
    //         );
    // }



    // prints the label
    onPrint() {
        const label = dymo.label.framework.openLabelFile("C://code/ItemLabel-1.label");
        // load image from url and store as Base64
        //var image = dymo.label.framework.loadImageAsPngBase64("C://code/internal/src/assets/images/home-gear.png");
        // overwrite image "Image" from XML label with loaded image
        label.setObjectText("SKU", this.selected.VendorSKU);
        label.setObjectText("Barcode", '0200022');
        label.setObjectText("TPIN", this.selected.TPIN);

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
