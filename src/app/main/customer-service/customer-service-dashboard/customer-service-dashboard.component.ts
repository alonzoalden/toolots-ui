import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import * as linkData from './customer-service-dashboard.links.json';

@Component({
    selector: 'customer-service-dashboard',
    templateUrl: './customer-service-dashboard.component.html',
    styleUrls: ['./customer-service-dashboard.component.scss'],
    animations: fuseAnimations
})

export class CustomerServiceDashboardComponent implements OnInit, OnDestroy {
    categories: any[];
    links: any[];
    linksFilteredByCategory: any[];
    filteredLinks: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    @ViewChild('matRipple') button: MatButton;
    buttonList =  linkData.links;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private router: Router
    ) {
        // Set the defaults
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.searchEnabled = false;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe/retreive Dashboard components
        this.filteredLinks = this.links = this.buttonList;
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
        this.toggleSearch();
        this.searchTerm = '';
        this.filterLinksByTerm();
    }
    activateButtonRipple(item) {
        item.ripple.launch({ centered: true });
        setTimeout(() => {
            this.button._elementRef.nativeElement.click();
        }, 0);
    }
    goto(url) {
        this.router.navigate([url]);
    }
    filterLinksByTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();
        // Search
        if (searchTerm === '') {
            this.filteredLinks = this.links;
        }
        else {
            this.filteredLinks = this.links.filter((link) => {
                return link.title.toLowerCase().includes(searchTerm);
            });
        }
    }
}
