import "../src/init.js"
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import legacy from './contracts/legacy'
import signAndSend from "@stellar/freighter-api"
import { signTransaction ,getPublicKey} from '@stellar/freighter-api'
import {Server} from "@stellar/stellar-sdk/lib/soroban/server.js"
import { Address ,TransactionBuilder,BASE_FEE ,Networks,xdr,Transaction,Account,SorobanRpc} from "@stellar/stellar-sdk"
import {legacyContract} from "../packages/legacy/contractClass.js"
import './App.css'
import { nativeToScVal } from "@stellar/stellar-sdk"

function App() {
  const testParam = async ()=>{
    const contractAddress = 'CAXGSTMD2OK5YHE2FFTTL7723F63CBPX3V24ED74FFUGUXKP5AQQMEZE';
    const userAccount = new Address('GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B');
      const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",{
        allowHttp:true
      }
    );


    const myContract = new legacyContract(contractAddress);
    const operation = myContract.param_test(userAccount);
      let  publicKey = await getPublicKey();
        console.log(publicKey)
        const latest = await server.getLatestLedger();
        const sourceAccount = await server.getAccount(publicKey)
        
    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(operation)
      .setTimeout(100)
      .build()

    const simulatedTx: SorobanRpc.Api.SimulateTransactionResponse =
          await server.simulateTransaction(builtTransaction);
const assembledTx = SorobanRpc.assembleTransaction(builtTransaction, simulatedTx).build();

    const transaction = await signTransaction(assembledTx.toEnvelope().toXDR("base64"),{ networkPassphrase: 
        Networks.TESTNET})
    console.log(transaction);
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, 'base64');
    console.log(txEnvelope)
        const send = await server.sendTransaction(new Transaction(txEnvelope,Networks.TESTNET));
        console.log(send)
  }
  return (
    <>
    <button onClick={testParam}>Test param tx</button>
    </>
  )
}

export default App
