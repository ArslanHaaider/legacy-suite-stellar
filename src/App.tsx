import "../src/init.js"
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import legacy from './contracts/legacy'
import signAndSend from "@stellar/freighter-api"
import { signTransaction } from '@stellar/freighter-api'
import './App.css'
import { nativeToScVal } from "@stellar/stellar-sdk"

function App() {
  const testParam = async ()=>{
      let token_address = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
      const testAddress = nativeToScVal("GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B",{
        type:"address"
      })
      const tx = await legacy.param_test({from:"GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B"})
      const {result} = await tx.signAndSend({signTransaction,force:true})
      console.log(result)
  }
  return (
    <>
    <button onClick={testParam}>Test param tx</button>
    </>
  )
}

export default App
