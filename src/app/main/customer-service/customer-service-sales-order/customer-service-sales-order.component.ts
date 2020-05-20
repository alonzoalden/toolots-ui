import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-customer-service-sales-order',
    templateUrl: './customer-service-sales-order.component.html',
    styleUrls: ['./customer-service-sales-order.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CustomerServiceSalesOrderComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
