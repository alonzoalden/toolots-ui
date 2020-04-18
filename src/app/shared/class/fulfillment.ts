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
        public PickedOn: string,
        public PackedBy: string,
        public PackedOn: string,
        public ShippedBy: string,
        public ShippedOn: string,
        public HasMissingItem: string,
        public Action: string,
        public FulfillmentLines: FulfillmentLine[],

    ) {}
}
export class FulfillmentLine {
    constructor(
        public FulfillmentLineID: string,
        public ItemID: string,
        public ItemImagePath: string,
        public ItemTPIN: string,
        public ItemSKU: string,
        public Quantity: number,
        public IsNotFound: boolean,
        public IsPicked: boolean,
        public ConfirmedBy: string,
        public ConfirmedOn: Date,
        public FulfillmentLineInventoryDetails: FulfillmentLineInventoryDetail[],
        public FulfillmentLineConfirms: FulfillmentLineConfirm[],
        public orderedQty: number,
        public confirmedQty: number
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
