import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceDashboardComponent } from './customer-service-dashboard.component';

describe('CustomerServiceDashboardComponent', () => {
  let component: CustomerServiceDashboardComponent;
  let fixture: ComponentFixture<CustomerServiceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerServiceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
