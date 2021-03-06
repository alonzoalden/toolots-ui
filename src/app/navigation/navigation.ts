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
                        id       : 'order_detail',
                        title    : 'Order Detail',
                        translate: 'NAV.ORDER_DETAIL',
                        type     : 'item',
                        icon     : 'receipt',
                        url      : '/customer-service/order-detail',
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
                        id       : 'order_detail',
                        title    : 'Order Detail',
                        translate: 'NAV.ORDER_DETAIL',
                        type     : 'item',
                        icon     : 'receipt',
                        url      : '/warehouse/order-detail',
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
                    },

                ]
            }
        ]
    }
];
