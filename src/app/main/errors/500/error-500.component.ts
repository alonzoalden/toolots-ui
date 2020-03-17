import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: 'error-500',
    templateUrl: './error-500.component.html',
    styleUrls: ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Error500Component implements OnInit {
    errorMessage: string;
    /**
     * Constructor
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
    ) {
        this.errorMessage = '';
    }
    ngOnInit() {
        this.errorMessage = window.history.state.message;
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
}
