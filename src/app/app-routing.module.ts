import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


const appRoutes: Routes = [
  {
      path: 'warehouse',
      loadChildren: () => import('./main/warehouse/warehouse.module').then(mod => mod.WarehouseModule),
      canLoad: [ AuthGuard ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
