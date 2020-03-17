import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { FileManagerModule } from './main/file-manager/file-manager.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from './fake-db/fake-db.service';
import { LandingPageModule } from './main/landing/landing.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_BASE_HREF } from '@angular/common';
import { RequestInterceptor } from './core/request.interceptor';
import { ResponseInterceptor } from './core/response.interceptor';
import { WarehouseModule } from './main/warehouse/warehouse.module';
import { Error404Module } from './main/errors/404/error-404.module';
import { Error500Module } from './main/errors/500/error-500.module';
import { AppService } from './app.service';
import { WarehouseItemUpdateModule } from './main/warehouse/warehouse-item-update/warehouse-item-update.module';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled', // Add options right here
        }),
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [ environment.webapiURL ],
                sendAccessToken: true
            }
        }),
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        LandingPageModule,
        SampleModule,
        // FileManagerModule,
        WarehouseItemUpdateModule,
        WarehouseModule,
        Error404Module,
        Error500Module,
    ],
    providers: [
        AppService,
        AuthGuard,
        { provide: APP_BASE_HREF, useValue: '/'},
        { provide: OAuthStorage, useValue: localStorage },
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
