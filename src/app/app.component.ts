import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth/auth.config';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from './app.service';
import { Member } from './shared/class/member';
@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private oauthService: OAuthService,
        private router: Router,
        private route: ActivatedRoute,
        public appService: AppService
    ) {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         *
         */

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /* *
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    get wasLoggedIn() {
        return (this.appService.wasLoggedIn || this.appService.isLoggedin) && !(this.router.url === '/home' || this.router.url === '/');
    }
    private configureWithNewConfigApi() {
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
    private initInterval() {
        setInterval(() => {
            if (this.appService.wasLoggedIn && !this.appService.isLoggedin) {
                this.appService.logout();
            }
        }, 5000);
    }

    private setCustomConfig(fuseconfig) {
        fuseconfig.layout.footer.hidden = true;
        return fuseconfig;
    }
    ngOnInit(): void {
        // Configure Auth
        this.configureWithNewConfigApi();

        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((defaultConfig) => {
                this.fuseConfig = this.setCustomConfig(defaultConfig);
                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }
                for (const className of this.document.body.classList) {
                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }
                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        // If Oauth token received, navigate to main app
        this.oauthService.events
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(e => {
                if (e.type === 'token_received' && this.appService.isLoggedin) {
                    this.appService.setWasLoggedIn();
                    this.getCurrentMemberAndRedirect();
                }
        });

        // if the user is logged in
        if (this.appService.isLoggedin) {
            // if we are at the landing page
            if (this.router.url === '/') {
                this.getCurrentMemberAndRedirect();
            }
            // else if we are anywhere else in the app
            else {
                this.appService.getCurrentMember()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                    () => this._fuseSplashScreenService.hide()
                );
            }
        }
    }

    getCurrentMemberAndRedirect() {
        this.appService.getCurrentMember()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((member: Member) => {
                if (member.MemberID) {
                    this.router.navigate(['/warehouse']);
                    this._fuseSplashScreenService.hide();
                }
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
