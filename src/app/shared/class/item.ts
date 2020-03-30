// GET https://staging-webapi.toolots.com.cn/gadget/warehouse/allitemlist
export class ItemList {
    constructor(
        public ItemID: string,
        public Description: string,
        public ItemName: string,
        public TPIN: string,
        public VendorSKU: string,
        public ImagePath: string,
        public Data: Item,
    ) {}
}

// HttpGet
// HttpPut
// https://staging-webapi.toolots.com.cn/gadget/item/{id}

export class Item {
    constructor(
        public ItemID: string,
        public TPIN: string,
        public Name: string,
        public VendorSKU: string,

        public Price: string,

        public ImagePath: string,

        public Width: number,
        public Height: number,
        public Length: number,
        public ProductDimensionUOM: string,
        public Weight: number,
        public ProductWeightUOM: string,

        public PackageWidth: number,
        public PackageHeight: number,
        public PackageLength: number,
        public PackageDimensionUOM: string,
        public PackageWeight: number,
        public PackageWeightUOM: string,
        public PackagingType: number,
        public UnitPerPackage: number,
        public MaximumParcelUnit: number,

        public ItemInventoryDetails: Array<ItemInventoryDetail>,
        public ItemCartonInformations: Array<ItemCartonInformation>,
        public ItemPotentialLocations: Array<ItemPotentialLocation>,
    ) {}
}
export class ItemInventoryDetail {
    constructor(
        public LocationName: string,
        public BinNumber: string,
        public QtyOnHand: number,
        public QtyAvailable: number
    ) {}
}
export class ItemCartonInformation {
    constructor(
        public PONumber: string,
        public ContainerNumber: string,
        public InboundShipmentNumber: string,
        public CartonNumber: string,
        public Quantity: number
    ) {}
}
export class ItemPotentialLocation {
    constructor(
        public LocationName: string,
        public BinNumber: string,
        public LocationDate: string,
        public SearchMethod: string
    ) {}
}
