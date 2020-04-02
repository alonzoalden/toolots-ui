import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInboundComponent } from './warehouse-inbound.component';

describe('WarehouseInboundComponent', () => {
    let component: WarehouseInboundComponent;
    let fixture: ComponentFixture<WarehouseInboundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WarehouseInboundComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WarehouseInboundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
