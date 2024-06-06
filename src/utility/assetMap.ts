import { contract } from "@stellar/stellar-sdk";
import { AssetMapType } from "../components/types/benificiary";

export const    AssetMap:AssetMapType = {
    "USDC":{
        image:"/USD.svg",
        contract:"CBJORFXBOOZCU2M7GZ4I5AFZVBT6FIGED4SXADVY732R7JX6AZBMMTRL"
    },
    "BTC":{
        image:"/BTC.svg",
        contract:"CDEA6TA2JPGV5TZOFTEXCEDY32PR4RIQIRKIQED34SL7ALIAHROP62G6"
    },
    "native":{
        image:"/XLM.svg",
        contract:"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
    },
    "ETH":{
        image:"/ETH.svg",
        contract:"CBUEYB4JLUFVMRI7MNJWKYOSXJJJINDSVBTL7XBUOVFGTSPV3OYABNJZ"
    },
    "USDT":{
        image:"/USDT.svg",
        contract:"CBMW7CTGOBSH4263MUAZYZOSYYS5NHQSUJJEKNCD5JTVGPLDL7AO2UPC"
    },
    "XRP":{
        image:"/public/XRP.svg",
        contract:"CDLOZTGPPU6WMWV3ABLX5HGZFDCBIED5QMQBY6BK2TYLVUL3EO4FY6VO"
    }
}