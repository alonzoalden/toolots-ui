import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkshipFulfillmentActionsComponent } from './markship-fulfillment-actions.component';

describe('MarkshipFulfillmentActionsComponent', () => {
  let component: MarkshipFulfillmentActionsComponent;
  let fixture: ComponentFixture<MarkshipFulfillmentActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkshipFulfillmentActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkshipFulfillmentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
