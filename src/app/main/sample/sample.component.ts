import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

@Component({
    selector: 'sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public _fuseSplashScreenService: FuseSplashScreenService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }
    ngOnInit() {
        this._fuseSplashScreenService.hide();
    }
}
