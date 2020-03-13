import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector     : 'error-500',
    templateUrl  : './error-500.component.html',
    styleUrls    : ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Error500Component implements OnInit
{
    errorMessage: string;
    /**
     * Constructor
     */
    constructor()
    {
        this.errorMessage = '';
    }
    ngOnInit() {
        this.errorMessage = window.history.state.message;
    }
}
