import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'Gadgets',
        title    : 'Gadgets',
        translate: 'NAV.GADGETS',
        type     : 'group',
        children : [
            {
                id       : 'customer_service',
                title    : 'Customer Service',
                translate: 'NAV.CUSTOMER_SERVICE',
                type     : 'collapsable',
                icon     : 'perm_phone_msg',
                url      : '/customer-service',
                exactMatch: true,
                children : [
                    {
                        id       : 'sales_order',
                        title    : 'Sales Order',
                        translate: 'NAV.SALES_ORDER',
                        type     : 'item',
                        icon     : 'receipt',
                        url      : '/customer-service/sales-order',
                        exactMatch: true
                    }
                ]
            },
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
                        url      : '/warehouse/item-management',
                        exactMatch: true
                    },
                    {
                        id       : 'outbound',
                        title    : 'Outbound',
                        translate: 'NAV.OUTBOUND',
                        type     : 'item',
                        icon     : 'next_week',
                        url      : '/warehouse/outbound',
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
