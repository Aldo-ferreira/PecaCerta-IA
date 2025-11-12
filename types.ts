
export interface PartDetails {
  partName: string;
  description: string;
  specifications: {
    key: string;
    value: string;
  }[];
}

export interface MarketplaceListing {
  seller: string;
  priceBRL: number;
  shippingTime: string;
  rating: number;
}

export interface PartIdentificationResult {
  identifiedPart: PartDetails;
  equivalentParts: string[];
  marketplaceListings: MarketplaceListing[];
}
