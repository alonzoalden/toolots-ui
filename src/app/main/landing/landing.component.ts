import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppService } from 'app/app.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LandingPageComponent {
    constructor(
        private _fuseConfigService: FuseConfigService,
        public _fuseSplashScreenService: FuseSplashScreenService,
        private oauthService: OAuthService,
        public appService: AppService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    login() {
        this.oauthService.initImplicitFlow();
    }
}
