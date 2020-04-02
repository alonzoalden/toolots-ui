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
                exactMatch: true,
                children : [
                    {
                        id       : 'itemupdate',
                        title    : 'Item Management',
                        translate: 'NAV.ITEMUPDATE',
                        type     : 'item',
                        icon     : 'build',
                        url      : '/warehouse/warehouse-item-update',
                        exactMatch: true
                    },
                    {
                        id       : 'outbound',
                        title    : 'Outbound',
                        translate: 'NAV.OUTBOUND',
                        type     : 'item',
                        icon     : 'next_week',
                        url      : '/warehouse/outbound',
                        exactMatch: true
                    },
                    {
                        id       : 'inbound',
                        title    : 'Inbound',
                        translate: 'NAV.INBOUND',
                        type     : 'item',
                        icon     : 'move_to_inbox',
                        url      : '/warehouse/inbound',
                        exactMatch: true
                    }

                ]
            }
        ]
    }
];
