import { Routes, RouterModule } from '@angular/router';
import { CustomerServiceComponent } from './customer-service.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { CustomerServiceDashboardComponent } from './customer-service-dashboard/customer-service-dashboard.component';
import { CustomerServiceSalesOrderComponent } from './customer-service-sales-order/customer-service-sales-order.component';
import { CustomerServiceSalesOrderListComponent } from './customer-service-sales-order/sales-order-list/sales-order-list.component';

const CUSTOMER_SERVICE_ROUTES: Routes = [
    {
        path: '',
        component: CustomerServiceComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: CustomerServiceDashboardComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'sales-order',
                component: CustomerServiceSalesOrderComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: CustomerServiceSalesOrderListComponent,
                    },
                ]
            }
        ],
    },
];
export const CustomerServiceRouting = RouterModule.forChild(CUSTOMER_SERVICE_ROUTES);
