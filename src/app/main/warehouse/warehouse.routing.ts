import { Routes, RouterModule } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { WarehouseDashboardComponent } from './warehouse-dashboard/warehouse-dashboard.component';
import { WarehouseItemManagerComponent } from './warehouse-item-manager/warehouse-item-manager.component';
import { WarehouseItemManagerListComponent } from './warehouse-item-manager/item-manager-list/item-manager-list.component';
import { WarehouseOutboundComponent } from './warehouse-outbound/warehouse-outbound.component';
import { WarehouseOutboundListComponent } from './warehouse-outbound/outbound-list/outbound-list.component';
import { WarehouseInboundComponent } from './warehouse-inbound/warehouse-inbound.component';

const WAREHOUSE_ROUTES: Routes = [
    {
        path: '',
        component: WarehouseComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: WarehouseDashboardComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'item-management',
                component: WarehouseItemManagerComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: WarehouseItemManagerListComponent,
                    },
                ]
            },
            {
                path: 'outbound',
                component: WarehouseOutboundComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: WarehouseOutboundListComponent,
                    }
                ]
            },
            {
                path: 'inbound',
                component: WarehouseInboundComponent,
                canActivate: [AuthGuard],
            }
        ],
    },
];
export const WarehouseRouting = RouterModule.forChild(WAREHOUSE_ROUTES);
