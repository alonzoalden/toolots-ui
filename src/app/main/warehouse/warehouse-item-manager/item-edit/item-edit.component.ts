import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { ItemList } from 'app/shared/class/item';
import { WarehouseItemManagerService } from '../warehouse-item-manager.service';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'environments/environment';


@Component({
    selector: 'item-edit',
    templateUrl: './item-edit.component.html',
    styleUrls: ['./item-edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WarehouseItemEditComponent implements OnInit, OnDestroy {
    product: ItemList;
    pageType: string;
    productForm: FormGroup;
    selected: any;
    fileURL = environment.fileURL;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private warehouseItemManagerService: WarehouseItemManagerService,
        private router: Router,
    ) {
        // Set the default
        this.product = new ItemList(null, null, null, null, null, null, null);

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
        this.warehouseItemManagerService.onFileSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selected => {
                this.selected = selected;
                this.product = selected;
            });
        this.productForm = this.createProductForm();
        if (!this.selected.ItemID) {
            this.router.navigate(['warehouse-item-update']);
        }
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

    // /**
    //  * Create product form
    //  *
    //  * @returns {FormGroup}
    //  */
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ItemID: [this.product.ItemID],
            ItemName: [this.product.ItemName],
            Description: [this.product.Description],
            TPIN: [this.product.TPIN],
            VendorSKU: [this.product.VendorSKU],
            ImagePath: [this.product.ImagePath],
        });
    }

    /**
     * Save product
     */
    // saveProduct(): void
    // {
    //     const data = this.productForm.getRawValue();
    //     data.handle = FuseUtils.handleize(data.name);

    //     this._ecommerceProductService.saveProduct(data)
    //         .then(() => {

    //             // Trigger the subscription with new data
    //             this._ecommerceProductService.onProductChanged.next(data);

    //             // Show the success message
    //             this._matSnackBar.open('Product saved', 'OK', {
    //                 verticalPosition: 'top',
    //                 duration        : 2000
    //             });
    //         });
    // }

    /**
     * Add product
     */
    // addProduct(): void
    // {
    //     const data = this.productForm.getRawValue();
    //     data.handle = FuseUtils.handleize(data.name);

    //     this._ecommerceProductService.addProduct(data)
    //         .then(() => {

    //             // Trigger the subscription with new data
    //             this._ecommerceProductService.onProductChanged.next(data);

    //             // Show the success message
    //             this._matSnackBar.open('Product added', 'OK', {
    //                 verticalPosition: 'top',
    //                 duration        : 2000
    //             });

    //             // Change the location with new one
    //             this._location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
    //         });
    // }
}
