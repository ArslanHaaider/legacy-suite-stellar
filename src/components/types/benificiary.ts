
type ValueItem = [
    string,
    string,
    bigint,
    boolean
  ];

type AssetType = {
    token:string,
    from:string,
    value:bigint,
    claimed:boolean,
}

interface AssetDetails {
    image: string;
    contract: string;
  }
type AssetMapType = Record<string, AssetDetails>;

type Codes = Record<string,string>;

export type {ValueItem,AssetType,Codes,AssetMapType};