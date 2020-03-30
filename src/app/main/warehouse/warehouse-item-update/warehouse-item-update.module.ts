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

import { MailComposeDialogComponent } from 'app/main/warehouse/warehouse-item-update/dialogs/compose.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthGuard } from 'app/auth/auth.guard';
import { WarehouseItemUpdateComponent } from './warehouse-item-update.component';
import { WarehouseItemUpdateService } from './warehouse-item-update.service';
import { WarehouseItemUpdateListComponent } from './item-list/item-list.component';
import { WarehouseItemUpdateMainSidebarComponent } from './sidebars/main/main.component';
import { WarehouseItemUpdateDetailsSidebarComponent } from './sidebars/details/details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WarehouseItemEditComponent } from './item-edit/item-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CartonInformationDialogComponent } from './dialogs/carton-information/carton-information.component';
import { PotentialLocationDialogComponent } from './dialogs/potential-location/potential-location.component';
import { InventoryDetailDialogComponent } from './dialogs/inventory-detail/inventory-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintLabelDialogComponent } from './dialogs/print-label/print-label.component';

const routes: Routes = [
    {
        path: 'warehouse-item-update',
        component: WarehouseItemUpdateComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
              path: '',
              component: WarehouseItemUpdateListComponent,
            },
            {
                path: 'edit/:id',
                component: WarehouseItemEditComponent,
            },
        ],
        resolve: {
            files: WarehouseItemUpdateService
        },
    }
];

@NgModule({
    declarations: [
        WarehouseItemUpdateComponent,
        WarehouseItemUpdateListComponent,
        WarehouseItemUpdateDetailsSidebarComponent,
        WarehouseItemUpdateMainSidebarComponent,
        WarehouseItemEditComponent,
        // FileManagerComponent,
        // FileManagerFileListComponent,
        // FileManagerMainSidebarComponent,
        // FileManagerDetailsSidebarComponent,
        MailComposeDialogComponent,
        CartonInformationDialogComponent,
        InventoryDetailDialogComponent,
        PotentialLocationDialogComponent,
        PrintLabelDialogComponent
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
        BrowserAnimationsModule,
    ],
    providers: [
        WarehouseItemUpdateService,
        MatSnackBar
    ],
    entryComponents: [
        MailComposeDialogComponent,
        CartonInformationDialogComponent,
        InventoryDetailDialogComponent,
        PotentialLocationDialogComponent,
        PrintLabelDialogComponent
    ]
})
export class WarehouseItemUpdateModule {
}
