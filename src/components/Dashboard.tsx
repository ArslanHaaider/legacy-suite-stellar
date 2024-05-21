
import { getPublicKey } from "@stellar/freighter-api";
import { Address, rpc, scValToNative, xdr } from "@stellar/stellar-sdk";
import { useEffect } from "react";
const Dashboard =()=>{
    let data;
  
      useEffect(()=>{
        const fetchAssets = async()=>{
            const server = new rpc.Server("https://soroban-testnet.stellar.org:443",{
              allowHttp:true
            })
        const publicKey = await getPublicKey();
         const address = new Address(publicKey).toScAddress();
         const key = xdr.ScVal.scvAddress(address)
          data = await server.getContractData("CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2",key)
          let values = scValToNative(data.val.contractData().val());
          console.log(values[publicKey])
          }
          fetchAssets();
      },[])

    return(
        <>
        <div className="h-full border">
        <h1 className="text-center font-bold text-lg mt-3">
            Dashboard   
            </h1>
        </div>
        </>
    )
}
export default Dashboard