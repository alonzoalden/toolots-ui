import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthGuard } from 'app/auth/auth.guard';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseDashboardComponent } from './warehouse-dashboard/warehouse-dashboard.component';
import { WarehouseItemManagerModule } from './warehouse-item-manager/warehouse-item-manager.module';
import { WarehouseItemManagerService } from './warehouse-item-manager/warehouse-item-manager.service';
import { WarehouseOutboundModule } from './warehouse-outbound/warehouse-outbound.module';
import { WarehouseRouting } from './warehouse.routing';
import { WarehouseService } from 'app/main/warehouse/warehouse.service';

@NgModule({
    declarations: [
        WarehouseComponent,
        WarehouseDashboardComponent,
    ],
    imports: [
        WarehouseRouting,
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
        FuseSharedModule,
        FuseSidebarModule,
        WarehouseItemManagerModule,
        WarehouseOutboundModule,
    ],
    providers: [
        WarehouseService,
        WarehouseItemManagerService,
        AuthGuard
    ]
})
export class WarehouseModule {}
