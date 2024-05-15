import legacy from "../contracts/legacy";
import { ContractSpec, Transaction, XdrLargeInt } from "@stellar/stellar-sdk";
import { getPublicKey, signTransaction} from "@stellar/freighter-api";
import { useEffect, useState } from "react";
import { Address } from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/lib/soroban/server";
import { BASE_FEE, Contract, Networks, ScInt, StrKey, SorobanRpc,TransactionBuilder, nativeToScVal, xdr,Account} from "@stellar/stellar-sdk";
import {legacyContract} from "../../packages/legacy/contractClass";
const AddAsset = () => {
    let messageHash;
    let preparedTransaction;
    let publicKeyBuffer;
    let signature;
const [selectedValues, setSelectedValues] = useState<string[]>([]);
const [selectAmount,setAmount] = useState('');
const [benificiaryAddress,setBenificiaryAddress] = useState('');
let amountLimit= 0;
useEffect(()=>{
    // const accountInfo = async ()=>{
    //     const server = new Server("https://horizon-testnet.stellar.org/",{
    //         allowHttp:true
    //      })
    //     const account = await server.loadAccount("GCWOV73MMIZO7JYOYLRZZZ2QLGFYFL2B45RP5PUMR45TBO23URGIXYWS")    
    //     amountLimit = parseInt(account.balances[0].balance);
    //     console.log(account.balances[0].balance)
    // }
    // accountInfo();
})
  const handleValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if(selectedValues.includes(newValue)){
        return
    }
    setSelectedValues(prevValues => [...prevValues, newValue]);
    console.log(selectedValues)
  };
  const handleAmount = (e:React.ChangeEvent<HTMLInputElement>)=>{
    console.log(e.target.value,amountLimit)
    // if(parseInt(e.target.value)>amountLimit){
    //     alert("You don't have enough asset for that value")
    // }
    setAmount(e.target.value);
  }
  const handleBenificaryAddress = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setBenificiaryAddress(e.target.value)
  }

//   const  add_Multiple = async ()=>{
//     const server = new SorobanRpc.Server(
//       "https://soroban-testnet.stellar.org:443",
//     );
//     const contractAddress =
//     "CAXGSTMD2OK5YHE2FFTTL7723F63CBPX3V24ED74FFUGUXKP5AQQMEZE";
//     const contract = new Contract(contractAddress);
//     // Transactions require a valid sequence number (which varies from one
//     // account to another). We fetch this sequence number from the RPC server.
//       let  publicKey = await getPublicKey();
//       let amountss =parseInt(selectAmount)
//       let paramAmounts = nativeToScVal(amountss,{type:'i128'});
//       let assetContract = nativeToScVal("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",{
//         type:"address"
//       })
//     const sourceAccount = await server.getAccount(publicKey);
//       let benificarys = nativeToScVal("GAOWQIPEENZNPTVZNWQRBJQ36XQSQQHMJFRGW5DQJJQGTSH5VUR35RI3",{
//         type:'address'
//       })
//       let user = nativeToScVal("GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B",{type:"address"})
//     const param1 = nativeToScVal({token:assetContract,benificary:benificarys,value:paramAmounts})
//     const objext = nativeToScVal({signer:assetContract,signer2:benificarys,value:paramAmounts})
//     const param2 = nativeToScVal([objext])
//     console.log(param1);
//     console.log(user);

//     // let builtTransaction = new TransactionBuilder(sourceAccount, {
//     //   fee: (2 ** 32 - 1).toString(),
//     //   networkPassphrase: Networks.TESTNET
//     // }).addOperation(contract.call("add_multiple_asset",...[param2,user]))
//     // .setTimeout(300)
//     // .build();
    
//     let builtTransaction = new TransactionBuilder(sourceAccount, {
//       fee: (2 ** 32 - 1).toString(),
//       networkPassphrase: Networks.TESTNET,
//     }).addOperation(contract.call("param_test",user))
//     .setTimeout(300)
//       .build();
  
//     console.log(`builtTransaction=${builtTransaction.toXDR()}`);
//     console.log()
//     preparedTransaction = await server.prepareTransaction(builtTransaction);
//    console.log(preparedTransaction,"printing prepared transaction")
//    let xdrString2 = builtTransaction.toEnvelope().toXDR("base64");
// //    messageHash = preparedTransaction.hash();
//     // let xdrString = preparedTransaction.toEnvelope().toXDR("base64")
//     const transaction = await signTransaction(xdrString2,{ networkPassphrase: 
//         Networks.TESTNET })
//     console.log(transaction);
//     const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, 'base64');
//     console.log(txEnvelope)
//     const send = await server.sendTransaction(new Transaction(txEnvelope,Networks.TESTNET));
// //     console.log(send.hash);
// //     // const testPublicKey = "GCWOV73MMIZO7JYOYLRZZZ2QLGFYFL2B45RP5PUMR45TBO23URGIXYWS"
// //     // publicKeyBuffer = StrKey.decodeEd25519PublicKey(publicKey)
// //     // const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, 'base64');
// //     //     signature = txEnvelope.v1().signatures()[0].signature();

//       //contract spec approach

//       // const   contractSpec = new ContractSpec(["AAAAAQAAAAAAAAAAAAAACkJlbmlmaWNhcnkAAAAAAAMAAAAAAAAACmJlbmlmaWNhcnkAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAL",
//       // "AAAAAQAAAAAAAAAAAAAABWFkbWluAAAAAAAAAQAAAAAAAAAGYWRtaW5zAAAAAAPqAAAD7gAAACA=",
//       // "AAAAAQAAAAAAAAAAAAAABVBhcmFtAAAAAAAAAwAAAAAAAAAKYmVuaWZpY2FyeQAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAV2YWx1ZQAAAAAAAAs=",
//       // "AAAAAAAAAAAAAAAJYWRkX2FkbWluAAAAAAAAAQAAAAAAAAAMYWRtaW5fYWRyZXNzAAAD7gAAACAAAAAA",
//       // "AAAAAAAAAAAAAAASYWRkX211bHRpcGxlX2Fzc2V0AAAAAAACAAAAAAAAAARkYXRhAAAD6gAAB9AAAAAKQmVuaWZpY2FyeQAAAAAAAAAAAARmcm9tAAAAEwAAAAEAAAAB",
//       // "AAAAAAAAAAAAAAALY2xhaW1fYXNzZXQAAAAABQAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB2NsYWltZXIAAAAAEwAAAAAAAAAHbWVzc2FnZQAAAAAOAAAAAAAAAAdhZGRyZXNzAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQAAAAAA=",
//       // "AAAAAAAAAAAAAAAPdGVzdF9hZG1pbl9zaWduAAAAAAAAAAABAAAAAQ==",
//       // "AAAAAAAAAAAAAAAKcGFyYW1fdGVzdAAAAAAAAgAAAAAAAAAHYWRkcmVzcwAAAAPqAAAH0AAAAAVQYXJhbQAAAAAAAAAAAAAEZnJvbQAAABMAAAABAAAAAQ=="])

//       // const scArgs = contractSpec.funcArgsToScVals("add_multiple_asset",{data:param1,from:user})
//       // console.log(scArgs);
//       // const call= contract.call("add_multiple_asset",...scArgs);
//       // console.log(call.toXDR("base64"));
//       //  let builtTransaction = new TransactionBuilder(sourceAccount, {
//       //     fee: (2 ** 32 - 1).toString(),
//       //     networkPassphrase: Networks.TESTNET,
//       //   }).addOperation(call)
//       //   .setTimeout(300)
//       //     .build();
//       //    let xdrString2 = builtTransaction.toEnvelope().toXDR("base64");
//       //    console.log(xdrString2);
//   }

  const add_Multiple = async () => {
    // let amount2 = new XdrLargeInt("i128",parseInt(selectAmount))
    // let token_address = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
    // let benificary =  "GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B"
    // let data2 = {
    //   token: token_address,
    //   value: amount2.toBigInt(),
    //   benificary:benificary,
    // };
    // let publicKey = await getPublicKey(); 
    // // console.log(dat1)
    // const tx = await legacy.add_multiple_asset({data:[data2],from:publicKey});
    // // const tx = await Legacy.test_admin_sign();
    // const { result } = await tx.signAndSend({signTransaction});
    // console.log(result);
    const contractAddress = 'CAXGSTMD2OK5YHE2FFTTL7723F63CBPX3V24ED74FFUGUXKP5AQQMEZE';
    const userAccount = new Address('GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B');
      const server = new Server(
      "https://soroban-testnet.stellar.org:443",{
        allowHttp:true
      }
    );
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.param_test(userAccount);
      let  publicKey = await getPublicKey();
        console.log(publicKey)
        // const sourceAccount = await server.getAccount(publicKey);
        const latest = await server.getLatestLedger();
        const sourceAccount = new Account(publicKey,latest.sequence.toString())
      console.log(sourceAccount.sequenceNumber());

    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(operation)
      .setTimeout(100)
      .build()
    console.log(builtTransaction);
  let   preparedTransaction = await server.prepareTransaction(builtTransaction);
  console.log(preparedTransaction)
   let xdrString2 = builtTransaction.toEnvelope().toXDR("base64");
//    messageHash = preparedTransaction.hash();
    // let xdrString = preparedTransaction.toEnvelope().toXDR("base64")
    const transaction = await signTransaction(xdrString2,{ networkPassphrase: 
        Networks.TESTNET})
    console.log(transaction);
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, 'base64');
    console.log(txEnvelope)
        const send = await server.sendTransaction(new Transaction(txEnvelope,Networks.TESTNET));
        console.log(send)
  };
  // const testParam = async ()=>{
  //     let token_address = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
  //     const tx = await legacy.param_test({address:token_address})
  //     const {result} = await tx.signAndSend({signTransaction,force:true})
  //     console.log(result)
  // }
  return (
    <div className="w-1/2 h-1/2 bg-gray-800 border border-red-300 flex flex-col justify-between items-center rounded-md pt-4 pb-4">
      <div className="flex flex-col w-3/4">
        <label htmlFor="benificiary">Add Benificiary Address</label>
        <input type="text" onChange={handleBenificaryAddress} className="input input-primary bg-slate-900 h-10" />
      </div>
      <div className="flex  w-3/4 justify-between">
        <div>
          <label htmlFor="asset">Choose an Asset:</label>
          <select name="asset"
        id="asset"
        onChange={handleValue}
        className="bg-slate-900 w-28 h-8 rounded-md">
            <option value="">Select an asset</option>
            <option className="bg-slate-900 w-28 h-8 rounded-md" value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC">
              XLM
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="benificiary">Add amount</label>
          <input type="text" onChange={handleAmount} className="input input-primary bg-slate-900 h-10" />
        </div>
      </div>
      <button className="btn btn-primary" onClick={add_Multiple}>Add benificary</button>
      {/* <button onClick={testParam}>Test Param</button> */}
    </div>
  );
};

export default AddAsset;
