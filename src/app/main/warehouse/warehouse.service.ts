import { Injectable } from '@angular/core';

@Injectable()
export class WarehouseService {
    dictPackingType = {
        4: 'LTL',
        5: 'Small Parcel',
    };
    units = [
        'IN',
        'CM'
    ];
    weightUnits = [
        'LB',
        'KG'
    ];
    buttonColorDict = {
        'Pack': 'green',
        'Pick': 'orange',
        'Mark Ship': 'pink',
    };

    constructor() {}

}
