import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkshipFulfillmentComponent } from './markship-fulfillment.component';

describe('MarkshipFulfillmentComponent', () => {
  let component: MarkshipFulfillmentComponent;
  let fixture: ComponentFixture<MarkshipFulfillmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkshipFulfillmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkshipFulfillmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
