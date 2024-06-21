import { contract } from "@stellar/stellar-sdk";
import { AssetMapType } from "../components/types/benificiary";

export const    AssetMap:AssetMapType = {
    "USDC":{
        image:"/USD.svg",
        contract:"CBCYTOXGIQF57QUG75WCAN2FVVO7KFX7M655REUS43CBFADLP4QKWTPJ"
    },
    "WBTC":{
        image:"/BTC.svg",
        contract:"CDZKQYQ7KEKUE4ZLFARP372I65ZHUPQ43RGDE47HHO2TXXBYDPR65D2L"
    },
    "native":{
        image:"/XLM.svg",
        contract:"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
    },
    "WETH":{
        image:"/ETH.svg",
        contract:"CAI726LPWHRQC4NB3EOF6DSS5ZZTWKSZYRWR54YSYY5SDY6UQ7QGFW3Z"
    },
    "USDT":{
        image:"/USDT.svg",
        contract:"CC3VEFL6YGAFLFBTFF52FXMJR3HVEK5IPQGDBGHARL6DYB7DTOVPAMS6"
    },
    "XRP":{
        image:"/public/XRP.svg",
        contract:"CB6K6DOSDUESZAGQMOCP4HEL7WL4VHQUOA7JA5DXGWL5ZZE6QYRYHBHY"
    }
}