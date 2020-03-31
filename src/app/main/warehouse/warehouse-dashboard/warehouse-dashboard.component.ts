import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { WarehouseService } from '../warehouse.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatRipple } from '@angular/material/core';
import { WarehouseItemManagerService } from '../warehouse-item-manager/warehouse-item-manager.service';
import * as linkData from './warehouse-dashboard.links.json';

@Component({
    selector: 'warehouse-dashboard',
    templateUrl: './warehouse-dashboard.component.html',
    styleUrls: ['./warehouse-dashboard.component.scss'],
    animations: fuseAnimations
})
export class WarehouseDashboardComponent implements OnInit, OnDestroy {
    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    searchEnabled: boolean;
    @ViewChild('matRipple') button: MatButton;
    warehouseButtonList =  linkData.links;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private warehouseService: WarehouseService,
        private router: Router,
        private warehouseItemManagerService: WarehouseItemManagerService
    ) {
        // Set the defaults
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.searchEnabled = false;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to categories
        this.warehouseService.onCategoriesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(categories => {
                this.categories = categories;
            });

        // Subscribe/retreive Dashboard components
        this.filteredCourses = this.courses = this.warehouseButtonList;
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleSearch(): void {
        this.searchEnabled = !this.searchEnabled;
    }
    cancelSearch(): void {
        this.toggleSearch();
        this.searchTerm = '';
        this.filterCoursesByTerm();
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
    filterCoursesByTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();
        // Search
        if (searchTerm === '') {
            this.filteredCourses = this.coursesFilteredByCategory;
        }
        else {
            this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }
}
