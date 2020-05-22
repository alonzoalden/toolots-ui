import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceSalesOrderComponent } from './customer-service-sales-order.component';
import { CustomerServiceSalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CustomerServiceService } from '../customer-service.service';
import { AuthGuard } from 'app/auth/auth.guard';
import {
    CustomerServiceSalesOrderListDetailsSidebarComponent
} from './sales-order-list/sales-order-list-details/sales-order-list-details.component';
import {
    SalesOrderEditAddressDialogComponent
} from './sales-order-list/dialogs/sales-order-edit-address/sales-order-edit-address.component';
import {
    FulfillmentInformationDialogComponent
} from './sales-order-list/dialogs/fulfillment-information/fulfillment-information.component';

const routes: Routes = [];

@NgModule({
    declarations: [
        CustomerServiceSalesOrderComponent,
        CustomerServiceSalesOrderListComponent,
        CustomerServiceSalesOrderListDetailsSidebarComponent,
        SalesOrderEditAddressDialogComponent,
        FulfillmentInformationDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatToolbarModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatTabsModule,
        MatChipsModule,
        MatSnackBarModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatStepperModule,
        FuseSharedModule,
        FuseSidebarModule,
        NgSelectModule,
        FormsModule
    ], providers: [
        CustomerServiceService,
        AuthGuard
    ],
    entryComponents: [
        SalesOrderEditAddressDialogComponent,
        FulfillmentInformationDialogComponent
    ]
})
export class CustomerServiceSalesOrderModule { }
