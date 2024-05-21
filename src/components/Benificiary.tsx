import FreighterComponent from "./ConnectFreighter"
import ClaimAsset from "./ClaimAsset"
import { useEffect } from "react"
import { xdr,Address } from "@stellar/stellar-sdk"
import { Server } from "@stellar/stellar-sdk/rpc"
import { getPublicKey } from "@stellar/freighter-api"
import Dashboard from "./Dashboard"
const Benificiary = ()=>{
    return(

        <>
            <div className="w-full  h-[86vh] flex justify-evenly items-center">
                <div className="w-1/3 h-[80vh]">
                    <ClaimAsset/>
                </div>
                <div className="w-2/4 h-[86vh]">
                <Dashboard/>
                </div>
            </div>
        </>
    )
}

export default Benificiary