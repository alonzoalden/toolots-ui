import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WarehouseOutboundComponent } from './warehouse-outbound.component';
import { WarehouseOutboundService } from './warehouse-outbound.service';
import { WarehouseOutboundListComponent } from './outbound-list/outbound-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WarehouseOutboundDetailsSidebarComponent } from './outbound-sidebars/outbound-details/outbound-details.component';
import { SelectShippingTypeDialogComponent } from './dialogs/select-shipping-type/select-shipping-type.component';
import { AddFulfillmentDialogComponent } from './dialogs/add-fulfillment/add-fulfillment.component';
import { PickFulfillmentDetailsSidebarComponent } from './pick-fulfillment/pick-fulfillment-details/pick-fulfillment-details.component';
import { PickFulfillmentComponent } from './pick-fulfillment/pick-fulfillment.component';

const routes: Routes = [];

@NgModule({
    declarations: [
        WarehouseOutboundComponent,
        WarehouseOutboundListComponent,
        WarehouseOutboundDetailsSidebarComponent,
        SelectShippingTypeDialogComponent,
        AddFulfillmentDialogComponent,
        PickFulfillmentDetailsSidebarComponent,
        PickFulfillmentComponent
    ],
    imports: [
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
        FuseSharedModule,
        FuseSidebarModule,
    ],
    providers: [
        WarehouseOutboundService,
        MatSnackBar
    ],
    entryComponents: [
        SelectShippingTypeDialogComponent,
        AddFulfillmentDialogComponent
    ]
})
export class WarehouseOutboundModule {
}
