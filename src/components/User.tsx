import "../../src/init.js" ;
import React, { useState, useEffect } from "react";
import FreighterComponent from "./ConnectFreighter";
import AddAsset from "./AddAsset";
import { Address, SorobanRpc, xdr } from "@stellar/stellar-sdk";
import ClaimAsset from "./AddAdmin.js";
import AddAdmin from "./AddAdmin.js";
const User = () => {
  const [address,setAddress] = useState('');
  const handleAddress =(e:React.ChangeEvent<HTMLInputElement>)=>{
    setAddress(e.target.value);
  }
  console.log("re rendered again")
  return (

        <div className="w-full h-[100vh] ">
          {/* <h1 className="text-lg font-bold text-center uppercase">Add assets for benificary</h1>     */}
          <AddAsset/>
          {/* <AddAdmin/> */}
        </div>  
        
  );
};

export default User;
