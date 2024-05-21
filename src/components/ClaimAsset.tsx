import { getPublicKey,signTransaction } from "@stellar/freighter-api";
import { useEffect, useState } from "react"
import {SorobanRpc,Address,BASE_FEE,TransactionBuilder,Networks,Transaction,xdr,Keypair,Contract,StrKey} from "@stellar/stellar-sdk"
import axios from "axios";
import { legacyContract } from "../../contractClass";
import { get } from "http";
 const ClaimAsset = ()=>{
   const [userAddress,setUserAddress] = useState("");
   const handleUserAddress = (e) => {
    setUserAddress(e.target.value);
  };

  const getAdminData = async()=>{
    try{
      const adminData =     await axios.get('/admin/Sign',{
        baseURL:"http://localhost:3000",
      })
      console.log(adminData.data)
      return adminData.data
    }catch(e){
      console.log("Error in (getAdminDataFunc):"+e)
    }
  }
  const addAdmin = async () => {
    let publicKey = await getPublicKey();
    const contractAddress =
      "CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2";
    const adminData  = await getAdminData();
    const adminAddres = new Address(adminData[2]);
    console.log(adminAddres.toBuffer())
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",
      {
        allowHttp: true,
      }
    );
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.add_admin(adminAddres.toBuffer());
    const sourceAccount = await server.getAccount(publicKey);

    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(100)
      .build();

    const simulatedTx = await server.simulateTransaction(builtTransaction);
    const assembledTx = SorobanRpc.assembleTransaction(
      builtTransaction,
      simulatedTx
    ).build();
    console.log(assembledTx.hash())
    const transaction = await signTransaction(
      assembledTx.toEnvelope().toXDR("base64"),
      {
        networkPassphrase: Networks.TESTNET,
      }
    );
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, "base64");
    console.log(txEnvelope.v1().signatures());
    const send = await server.sendTransaction(
      new Transaction(txEnvelope, Networks.TESTNET)
    );
    console.log(send.status);
  };
  
  const claimAsset = async()=>{
    let publicKey = await getPublicKey();
    const contractAddress =
      "CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2";
    const benificiaryAccount = new Address(publicKey);
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",
      {
        allowHttp: true,
      }
    );
    const adminData = await getAdminData();
    console.log((adminData));
    const Adminaddress = new Address(adminData[2]).toBuffer();
    const messageHash = adminData[0];
    const signatures = adminData[1]
    console.log(new Address(userAddress),benificiaryAccount,new Uint8Array(messageHash.data),Adminaddress,signatures.data);
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.claim_asset(new Address(userAddress),benificiaryAccount,new Uint8Array(messageHash.data),Adminaddress,new Uint8Array(signatures.data));
    const sourceAccount = await server.getAccount(publicKey); 

    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(100)
      .build();

    const simulatedTx = await server.simulateTransaction(builtTransaction);
    const assembledTx = SorobanRpc.assembleTransaction(
      builtTransaction,
      simulatedTx
    ).build();
    const transaction = await signTransaction(
      assembledTx.toEnvelope().toXDR("base64"),
      {
        networkPassphrase: Networks.TESTNET,
      }
    );
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, "base64");
    const send = await server.sendTransaction(
      new Transaction(txEnvelope, Networks.TESTNET)
    );
    console.log(send.status);
}

    return(
        <>
        <div className=" border border-slate-700 rounded-md h-full  flex flex-col justify-center items-center">
            <h1 className="text-center font-bold text-lg">
            Claim your Assets:    
            </h1>
            <input type="text" id="user" className="w-5/6 input-md bg-slate-900 rounded-md" onChange={(e) => handleUserAddress(e)}value={userAddress} placeholder="Enter Will writer's Address"/>
            <button onClick={claimAsset} className="rounded-md btn-md bg-indigo-500 rounded-md p-2 mt-10">claim Asset</button>
        </div>
        
        </>
    )
 }


 export default ClaimAsset