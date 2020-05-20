import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceSalesOrderComponent } from './customer-service-sales-order.component';

describe('CustomerServiceSalesOrderComponent', () => {
  let component: CustomerServiceSalesOrderComponent;
  let fixture: ComponentFixture<CustomerServiceSalesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerServiceSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
