// GET https://staging-webapi.toolots.com.cn/gadget/fulfillment/outbound
// GET https://staging-webapi.toolots.com.cn/gadget/fulfillment/{id}

// PUT
// fulfillment/{fulfillmentnumber}/pickup
// fulfillment/{id}
// fulfillment/fulfillmentline/{id}
export class Fulfillment {
    constructor(
        public FulfillmentID: string,
        public FulfillmentNumber: string,
        public TransactionDate: string,
        public ShippingMethod: string,
        public PickedUpBy: string,
        public PickedUpOn: string,
        public PickConfirmedBy: string,
        public PickConfirmedOn: string,
        public PickedBy: string,
        public PackedBy: string,
        public PackedOn: string,
        public ShippedBy: string,
        public ShippedOn: string,
        public PickedOn: string,
        public HasMissingItem: string,
        public ShippingType: string,
        public FulfillmentLines: FulfillmentLine[],

    ) {}
}
export class FulfillmentLine {
    constructor(
        public FulfillmentLineID: string,
        public ItemID: string,
        public ItemTPIN: string,
        public ItemSKU: string,
        public Quantity: number,
        public IsNotFound: string,
        public IsPicked: string,
        public ConfirmedBy: string,
        public ConfirmedOn: Date,
        public FulfillmentLineInventoryDetails: FulfillmentLineInventoryDetail[],
        public FulfillmentLineConfirms: FulfillmentLineConfirm[],

    ) {}
}
export class FulfillmentLineInventoryDetail {
    constructor(
        public BinNumber: string,
        public Quantity: number,

    ) {}
}
export class FulfillmentLineConfirm {
    constructor(
        public FulfillmentLineConfirmID: string,
        public BinNumber: string,
        public Quantity: number,

    ) {}
}
