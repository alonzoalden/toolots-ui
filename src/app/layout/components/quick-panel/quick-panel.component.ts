import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector     : 'quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit
{
    date: Date;
    events: any[] = [];
    notes: any[] = [];
    settings: any;

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };
    }
    ngOnInit() {
        this.notes.push({detail: 'Clean all aisles and follow procedures.', title: 'Inspection'});
        this.events.push({detail: 'Inspection this Friday. Mar 6. Clean all aisles and follow procedures.', title: 'Inspection'});
    }

}
