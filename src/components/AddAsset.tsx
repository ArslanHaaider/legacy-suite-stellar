import legacy from "../contracts/legacy";
import { Horizon, Transaction, XdrLargeInt } from "@stellar/stellar-sdk";
import { getPublicKey, signTransaction } from "@stellar/freighter-api";
import { useEffect, useState } from "react";
import { Address } from "@stellar/stellar-sdk";
import { legacyContract } from "../../contractClass";
import {
  BASE_FEE,
  Contract,
  Networks,
  ScInt,
  StrKey,
  SorobanRpc,
  TransactionBuilder,
  nativeToScVal,
  xdr,
  Account,
} from "@stellar/stellar-sdk";
// import { PrismaClient } from "@prisma/client";


const AddAsset = () => {
  const [assets, setAssets] = useState([{ asset: "", amount: "" }]);
  const [benificiaryAddress, setBenificiaryAddress] = useState("");
  // const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
  // const prisma = new PrismaClient();
  useEffect(() => {
    const accountInfo = async () => {
      const server = new Horizon.Server("https://horizon-testnet.stellar.org/", {
      });
      const account = await server.loadAccount("GDZDWPRWGMAVTNWBERD667PQ3BPCGIHEFQET6RRI4MZUS77ASHJMPT7B");
      let amountLimit = parseInt(account.balances[0].balance);
      console.log(account.balances);
    };
    accountInfo();
  }, []);
  const handleValue = (index, e) => {
    const newAssets = [...assets];
    newAssets[index][e.target.name] = e.target.value;
    setAssets(newAssets);
    console.log(assets)
  };

  const handleAmount = (index, e) => {
    const newAssets = [...assets];
    newAssets[index].amount = e.target.value;
    setAssets(newAssets);
  };

  const handleBenificaryAddress = (e) => {
    setBenificiaryAddress(e.target.value);
  };

  const addAssetSection = () => {
    setAssets([...assets, { asset: "", amount: "" }]);
    console.log(assets);
  };

  const removeAssetSection = (index) => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setAssets(newAssets);
  };

  const add_Multiple = async () => {
    console.log(assets)
    const data = assets.map((assetEntry) => {
      return {
        token: assetEntry.asset,
        benificary: benificiaryAddress,
        value: new XdrLargeInt(
          "i128",
          parseInt(assetEntry.amount) * 10000000
        ).toBigInt(),
      };
    });
    console.log(data)
    let publicKey = await getPublicKey();
    const contractAddress ="CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2";
    const userAccount = new Address(publicKey);
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",
      {
        allowHttp: true,
      }
    );
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.add_multiple(data, userAccount);
    const sourceAccount = await server.getAccount(publicKey);

    const builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(100)
      .build();
    console.log(builtTransaction)
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
    setTimeout(async()=>{
      const Result = await server.getTransaction(send.hash);
      if(Result.status == "SUCCESS"){
        alert("Transaction Successfull")
        setAssets([{ asset: "", amount: "" }])
        setBenificiaryAddress('');

      }
    },10000)
   
  };

  return (
    <div className="min-w-[30rem] min-h-[25rem] max-w-full max-h-full bg-gray-800 flex flex-col justify-between items-center rounded-md p-4 space-y-4">
      <div className="flex flex-col w-3/4">
        <input
          type="text"
          value={benificiaryAddress}
          placeholder="Add Benificiary Address here"
          onChange={handleBenificaryAddress}
          className="input-md rounded-md bg-slate-900 h-10"
        />
      </div>
      {assets.map((assetEntry, index) => (
        <div
          key={index}
          className="flex w-full justify-evenly mt-2 items-center  h-[10rem]"
        >
          <div>
          </div>
          <div className=" bg-slate-900 h-2/5 flex items-center p-3 ">
          <select
              name="asset"
              id={`asset-${index}`}
              value={assetEntry.asset}
              onChange={(e) => handleValue(index, e)}
              className="select-md bg-slate-900 w-38 h-8  border border-slate-500 rounded-md"
            >
              <option value="">Select an asset</option>
              <option
                
                value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
              >
                XLM
              </option>
              <option value="CA2E53VHFZ6YSWQIEIPBXJQGT6VW3VKWWZO555XKRQXYJ63GEBJJGHY7">
                USDC
              </option>
            </select>
            <input
              type="text"
              id={`amount-${index}`}
              value={assetEntry.amount}
              placeholder="Add amount"
              onChange={(e) => handleAmount(index, e)}
              className="input-md bg-slate-900 h-10"
            />
          </div>
          <button
            className="btn btn-danger ml-2"
            onClick={() => removeAssetSection(index)}
          >
            x
          </button>
        </div>
      ))}
      <button className="btn btn-secondary mt-4" onClick={addAssetSection}>
        + Add more Asset
      </button>
      <button className="btn btn-primary mt-4" onClick={add_Multiple}>
        Add benificary
      </button>
    </div>
  );
};

export default AddAsset;
