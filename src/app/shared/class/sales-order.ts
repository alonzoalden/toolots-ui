import { Fulfillment } from './fulfillment';
import { AddressTrans } from './address';

export class SalesOrder {
    constructor(
        public SalesOrderID: string,
        public IncrementID: string,
        public NetsuiteDocumentNumber: string,
        public TransactionDate: Date,
        public ShippingAddressTransID: string,
        public BillingAddressTransID: string,
        public SalesOrderLines: SalesOrderLine[],
        public Fulfillments: Fulfillment[],
        public shippingAddress: AddressTrans,
        public billingAddress: AddressTrans,
    ) {}
}
export class SalesOrderLine {
    constructor(
        public SalesOrderLineID: string,
        public ItemID: string,
        public ItemName: string,
        public ItemTPIN: string,
        public ItemVendorSKU: string,
        public ItemImagePath: string,
        public Quantity: number,
        public complete: boolean,
    ) {}
}
