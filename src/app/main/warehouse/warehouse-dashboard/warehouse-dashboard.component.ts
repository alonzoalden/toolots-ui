import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { WarehouseService } from '../warehouse.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-warehouse-dashboard',
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

  // but: HTMLElement;
  // @ViewChild('but', { read: ElementRef }) but: ElementRef;

  @ViewChild('matRipple') button: MatButton;


  // Private
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   *
   * @param {AcademyCoursesService} _academyCoursesService
   */
  constructor(
    private _academyCoursesService: WarehouseService,
    private router: Router,
  ) {
    // Set the defaults
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.searchEnabled = false;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to categories
    this._academyCoursesService.onCategoriesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(categories => {
        this.categories = categories;
      });

    // Subscribe to courses
    this._academyCoursesService.onCoursesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(courses => {
        this.filteredCourses = this.coursesFilteredByCategory = this.courses = courses;
      });
  }
  activateButtonRipple(item) {
    item.ripple.launch({centered: true});
    setTimeout(() => {
      this.button._elementRef.nativeElement.click();
    }, 0);
  }

  goto(url) {
    // console.log(this.button);
    this.router.navigate([url]);
  }
  /**
   * On destroy
   */
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
  /**
   * Filter courses by category
   */
  filterCoursesByCategory(): void {
    // Filter
    if (this.currentCategory === 'all') {
      this.coursesFilteredByCategory = this.courses;
      this.filteredCourses = this.courses;
    }
    else {
      this.coursesFilteredByCategory = this.courses.filter((course) => {
        return course.category === this.currentCategory;
      });

      this.filteredCourses = [...this.coursesFilteredByCategory];

    }

    // Re-filter by search term
    this.filterCoursesByTerm();
  }

  /**
   * Filter courses by term
   */
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
