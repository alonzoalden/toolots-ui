// GET https://staging-webapi.toolots.com.cn/gadget/warehouse/allitemlist
export class ItemList {
    constructor(
        public ItemID: string,
        public Description: string,
        public FOBPrice: number,
        public ItemName: string,
        public TPIN: string,
        public VendorSKU: string,
        public ImagePath: string
    ) {}
}

// HttpGet
// HttpPut
// https://staging-webapi.toolots.com.cn/gadget/warehouse/itemdimension/{id}

export class ItemDimension {
    constructor(
        public ItemID: string,
        public TPIN: string,
        public Name: string,
        public VendorSKU: string,

        public Price: string,

        public ImagePath: string,

        public Width: string,
        public Height: string,
        public Length: string,
        public ProductDimensionUOM: string,
        public Weight: number,
        public ProductWeightUOM: string,

        public PackageWidth: number,
        public PackageHeight: number,
        public PackageLength: number,
        public PackageDimensionUOM: string,
        public PackageWeight: number,
        public PackageWeightUOM: string,
        public PackagingType: string,
        public UnitPerPackage: number,
        public MaximumParcelUnit: number
    ) {}
}
