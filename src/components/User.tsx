import "../../src/init.js" ;
import React, { useState, useEffect } from "react";
import FreighterComponent from "./ConnectFreighter";
import AddAsset from "./AddAsset";
import { Address, SorobanRpc, xdr } from "@stellar/stellar-sdk";
const User = () => {
  const [address,setAddress] = useState('');
  const handleAddress =(e:React.ChangeEvent<HTMLInputElement>)=>{
    setAddress(e.target.value);
  }
  console.log("re rendered again")
  return (

        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-lg font-bold text uppercase">Add assets for benificary</h1>    
          <AddAsset/>
        </div>  
  );
};

export default User;
