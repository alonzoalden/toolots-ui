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
import { CustomerServiceDashboardComponent } from './customer-service-dashboard/customer-service-dashboard.component';
import { CustomerServiceRouting } from './customer-service.routing';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceComponent } from './customer-service.component';
import { CustomerServiceSalesOrderModule } from './customer-service-sales-order/customer-service-sales-order.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
    declarations: [
        CustomerServiceComponent,
        CustomerServiceDashboardComponent,
    ],
    imports: [
        CustomerServiceRouting,
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
        LightboxModule,
        CustomerServiceSalesOrderModule
    ],
    providers: [
        CustomerServiceService,
        AuthGuard
    ]
})
export class CustomerServiceModule {}
