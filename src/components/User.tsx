import "../../src/init.js" ;
import React, { useState, useEffect } from "react";
import FreighterComponent from "./ConnectFreighter";
import AddAsset from "./AddAsset";
import { Server  } from "@stellar/stellar-sdk/lib/soroban/server.js";
import { Address, xdr } from "@stellar/stellar-sdk";
const User = () => {
  const [address,setAddress] = useState('');
  const handleAddress =(e:React.ChangeEvent<HTMLInputElement>)=>{
    setAddress(e.target.value);
  }
  console.log("re rendered again")
  return (

        <div className="w-full h-[100vh] border border-red-500 flex flex-col items-center justify-center">
          <button className="btn btn-primary">
            <FreighterComponent/>
          </button>
          <h1>Add assets for benificary</h1>    
          <AddAsset/>

          <h2>Fetch the data from contract</h2>
          {/* <input type="text" onChange={handleAddress}/> */}
          <button onClick={async()=>{
           const server = new Server("https://horizon-testnet.stellar.org/",{
            allowHttp:true
         })
         const address = new Address("GCWOV73MMIZO7JYOYLRZZZ2QLGFYFL2B45RP5PUMR45TBO23URGIXYWS").toScAddress();
         const key = xdr.ScVal.scvAddress(address)
          const data = await server.getContractData("CDD6ODQOX7GEJOYW6DZ7KDSXPELJOPSYLOLMOGH22JPOZ33JOCWWK2EJ",key)
          console.log(data.val)
          }} className="btn btn-primary">Fetch the data</button>
        </div>
  );
};

export default User;
