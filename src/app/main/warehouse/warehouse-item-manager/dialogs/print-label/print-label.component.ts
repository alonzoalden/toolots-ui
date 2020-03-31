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

        this.warehouseItemManagerService.onFileSelected
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
    //                 this.warehouseItemManagerService.onFileSelected.next(this.selected);
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
