import { Fulfillment } from './fulfillment';

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
    ) {}
}
