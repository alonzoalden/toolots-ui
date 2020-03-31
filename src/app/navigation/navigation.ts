import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'Gadgets',
        title    : 'Gadgets',
        translate: 'NAV.GADGETS',
        type     : 'group',
        children : [
            {
                id       : 'warehouse',
                title    : 'Warehouse',
                translate: 'NAV.WAREHOUSE',
                type     : 'collapsable',
                icon     : 'business',
                url      : '/warehouse',
                children : [
                    {
                        id       : 'itemupdate',
                        title    : 'Item Management',
                        translate: 'NAV.ITEMUPDATE',
                        type     : 'item',
                        icon     : 'build',
                        url      : '/warehouse-item-update',
                        // badge    : {
                        //     title    : '25',
                        //     translate: 'NAV.SAMPLE.BADGE',
                        //     bg       : '#F44336',
                        //     fg       : '#FFFFFF'
                        // }
                    },
                    {
                        id       : 'outbound',
                        title    : 'Outbound',
                        translate: 'NAV.OUTBOUND',
                        type     : 'item',
                        icon     : 'next_week',
                        url      : '/warehouse-outbound',
                        // badge    : {
                        //     title    : '25',
                        //     translate: 'NAV.SAMPLE.BADGE',
                        //     bg       : '#F44336',
                        //     fg       : '#FFFFFF'
                        // }
                    }

                ]
                // badge    : {
                //     title    : '25',
                //     translate: 'NAV.SAMPLE.BADGE',
                //     bg       : '#F44336',
                //     fg       : '#FFFFFF'
                // }
            }
        ]
    }
];
