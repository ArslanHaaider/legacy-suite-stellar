
import { AssetMap } from "../utility/assetMap";
import { Horizon, Transaction, XdrLargeInt,rpc} from "@stellar/stellar-sdk";
import { getPublicKey, signTransaction } from "@stellar/freighter-api";
import { ReactEventHandler, useEffect, useState } from "react";
import { Address } from "@stellar/stellar-sdk";
import { legacyContract } from "../../contractClass";
import {
  BASE_FEE,
  Networks,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
// import { PrismaClient } from "@prisma/client";
// import { env } from "process";

interface Balance {
  asset_code: string;
  asset_issuer: string;
  asset_type: string;
  balance: string;
  buyinsetAssetsg_liabilities: string;
  is_authorized: boolean;
  is_authorized_to_maintain_liabilities: boolean;
  last_modified_ledger: number;
  limit: string;
  selling_liabilities: string;
}

const AddAsset = () => {
  const [assets, setAssets] = useState([{ asset: "", amount: "" }]);
  const [benificiaryAddress, setBenificiaryAddress] = useState("");
  const [loading ,setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [balance,setBalance ] = useState<Array<Balance>>();


  // const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
  useEffect(() => {
    const accountInfo = async () => {
      const server = new Horizon.Server("https://horizon-testnet.stellar.org/", {
      });
      const publicKey = await getPublicKey();
      let data  = await server.loadAccount(publicKey);
      // let amountLimit = parseInt(account.balances[0].balance);
      // console.log(account.balances);
      console.log(data.balances)
      // @ts-ignore
      setBalance(data.balances);
      // console.log(process.env.CONTRACTADDRESS)
    };
    accountInfo();
  }, []);
  const handleValue = (index, e) => {
    const newAssets = [...assets];
    newAssets[index][e.target.name] = e.target.value;
    setAssets(newAssets);
    console.log(assets)
  };

  const handleAmount = (index:number, e) => {
    const newAssets = [...assets];
    newAssets[index].amount = e.target.value;
    setAssets(newAssets);
  };

  const handleBenificaryAddress = (e:React.ChangeEvent<HTMLInputElement>) => {
    setBenificiaryAddress(e.target.value);
  };

  const addAssetSection = () => {
    setAssets([...assets, { asset: "", amount: "" }]);
    console.log(assets);
  };

  const removeAssetSection = (index:number) => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setAssets(newAssets);
  };
  const cleanStatus = ()=>{
    setAssets([{ asset: "", amount: "" }])
    setBenificiaryAddress('');
    setLoading(false)
    setAlert({ visible: false, type: '', message: '' });  
  }
  const add_Multiple = async () => {
    setLoading(true);
    try{
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
    const contractAddress =import.meta.env.VITE_CONTRACTADDRESS;
    const userAccount = new Address(publicKey);
    const server = new rpc.Server(
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
    // console.log(builtTransaction.toXDR())
    // const simulatedTx = await server.simulateTransaction(builtTransaction);
    // const assembledTx = rpc.assembleTransaction(
    //   builtTransaction,
    //   simulatedTx
    // ).build();
    const assembledTx = await server.prepareTransaction(builtTransaction);
    const transaction = await signTransaction(
      assembledTx.toEnvelope().toXDR("base64"),
      {
        networkPassphrase: Networks.TESTNET,
      }
    );
    const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, "base64");
    console.log(txEnvelope)
    const send = await server.sendTransaction(
      new Transaction(txEnvelope, Networks.TESTNET)
    );
    const latesLedgerValue = send.latestLedger;
    setTimeout(async()=>{
      const Result = await server.getTransaction(send.hash);
      if(Result.status == "SUCCESS"){
        setAlert({
          visible: true,
          type: 'success',
          message: 'Success! Your transaction was completed successfully.',
        }); 
        setAssets([{ asset: "", amount: "" }])
        setBenificiaryAddress('');
        setLoading(false)
      }
      else{
      console.log(send.diagnosticEvents);
        setAlert({
          visible: true,
          type: 'error',
          message: 'Error! Your transaction failed.',
        });
        setAssets([{ asset: "", amount: "" }])
        setBenificiaryAddress('');
        setLoading(false)
      }
      // try{
      //   let  data = await server.getEvents({
      //      startLedger:latesLedgerValue,
      //      filters:[
      //        {
      //          type:'contract',
      //          contractIds:['CBUZBFWE7LXJSRGS4O2IKFDPMMKFZCVP7SJJW4DYY4UUXAWI7222OU65'],
      //        }
      //      ]
           
      //    })
        //  console.log(data,latesLedgerValue)
        //  let submitData = await axios.post('/event/addAsset',{
        //    ledger:latesLedgerValue,
        //    contractId :data.events[0].contractId?.address().toString(),
        //    topic:scValToNative(data.events[0].topic[0]),
        //    willWriterAddress:scValToNative(data.events[0].topic[1]),
        //    benificiaryAddress:scValToNative(data.events[0].topic[2]),
        //    claimed:scValToNative(data.events[0].topic[3]),
        //    amount:scValToBigInt(data.events[0].value),
        //  },{
        //    baseURL:"http://localhost:3000",
        //  })
    //      console.log("event registered successfully")
    //  }catch(error){
    //    console.log("Error in Add Asset Method:",error)
    //  }
    },7000)
    }catch(error){
      console.log(error)

      setAlert({
        visible: true,
        type: 'error',
        message: 'Error! Your transaction failed.',
      });
      setTimeout(()=>{
        setAlert({ visible: false, type: '', message: '' })
      },4000)
    }

  };

  return (
  <div className="border w-full text-legacyBlue font-sans flex bg-[#FDFDFD]">
    <div className="w-1/5 min-h-screen  bg-[#FDFDFD]">
      <p className="text-center p-2 bg-white text-sm flex justify-evenly items-center w-4/5"> <span><img src="/dashboard.png" alt="" width={25} /></span><p>My Dashboard</p></p>
      <h1 className="text-left font-bold pl-4 pt-4 text-black text-sm">Crypto Protection</h1>
      <div className="w-full h-1/3  flex flex-col items-center justify-evenly text-sm">
        <button className="flex justify-evenly items-center w-2/3"> <span><img src="/monitoring.png" alt="" width={25}/></span><p>Wallet Monitoring</p></button>
        <button className="flex justify-evenly items-center w-2/3"><span><img src="/backup.png" alt="" width={25} /></span><p>Emergency Backup</p></button>
        <button className="flex justify-evenly items-center w-2/3" ><span><img src="/crypto.png" alt="" width={25} /></span><p>Crypto/NFT Will</p></button>
      </div>
    </div>
    <div className="w-4/5 bg-[#F5F5F5] min-h-screen flex flex-col">
        <h1 className="font-bold text-3xl text-legacyBlue p-4">Crypto / Nft Will</h1>
        <h1 className="font-bold text-md text-legacyBlue p-4">Your Assets</h1>
        {balance?.map((asset,index)=>{
          let image;
           const assetMapEntry = AssetMap[asset?.asset_code];
          
           if (asset.asset_type =="native"){
           // Skip rendering this item
              image = "native"
           }
           else if (!assetMapEntry){
            console.warn(`No entry found in AssetMap for asset code: ${asset?.asset_code}`);
            return null;
           }
           else{
            image = asset.asset_code
           }
          return(
            <>  
              <div key={index} className="border border-[#EFF0F1] flex min-h-24 items-center w-11/12 ml-4 mb-3 bg-[#FFFFFF] rounded-md">
                <img src={AssetMap[image].image} alt="" className=" w-1/12 h-1/3"/>
                <div className="inline ml-8">
                  <p>{image == "native"? "XLM":asset.asset_code}</p>
                  <p>{asset.balance}</p>  
                </div>
              </div>
            </>
          )
        })}

      {// @ts-ignore
        <div className="w-11/12 border h-1/6 sticky bottom-0 flex text-2xl ml-2 font-bold justify-evenly items-center bg-[#FFFFFF] rounded-md  border-[#EFF0F1]">Add Asset To Your Will <button className="bg-button p-2 rounded-md h-1/2 text-lg btn btn-info" onClick={()=> document.getElementById('my_modal_1').showModal()}>Add Asset</button> </div> }
<dialog id="my_modal_1" className="modal">
  <div className="modal-box min-w-[50rem] bg-[#ffff]">
  <div className="min-w-[40rem] min-h-[25rem] max-w-full max-h-full flex flex-col justify-between items-center rounded-md p-4 space-y-4 bg-[#ffff]">

      {assets.map((assetEntry, index) => (
        <div
          key={index}
          className="flex w-full justify-evenly items-center  h-[4rem]"
        >
          <div>
          </div>
          <div className=" bg-[#EFF0F1] h-4/5 flex items-center p-3 ">
          <select
              name="asset"
              id={`asset-${index}`}
              value={assetEntry.asset}
              onChange={(e) => handleValue(index, e)}
              className="select-sm bg-[#EFF0F1] rounded-md"
            >
              <option value="">Select an asset</option>
              {balance?.map((asset,index)=>{
                          let assetCode;
                          const assetMapEntry = AssetMap[asset?.asset_code];
                          if (asset.asset_type =="native") {
                            assetCode = "native"
                            
                          }
                          else if(!assetMapEntry){
                            console.warn(`No entry found in AssetMap for asset code: ${asset?.asset_code}`);
                            return null; // Skip rendering this item
                          }
                          else{
                           assetCode = asset.asset_code
                          }
                return(
                  <>
                  <option value={AssetMap[assetCode].contract}>{assetCode}</option>
                  </>
                )
              })}
            </select>
            <input
              type="text"
              id={`amount-${index}`}
              value={assetEntry.amount}
              placeholder="Add amount"
              onChange={(e) => handleAmount(index, e)}
              className="input-md bg-[#EFF0F1] h-10 ml-2"
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
      <button className="btn  btn-info bg-button text-legacyBlue" onClick={addAssetSection}>
        + Add more Asset
      </button>
      <div className="flex flex-col w-3/4">
        <input
          type="text"
          value={benificiaryAddress}
          placeholder="Add Benificiary Address here"
          onChange={handleBenificaryAddress}
          className="input-md rounded-md bg-[#EFF0F1] h-10"
        />
      </div>
      {loading?<span className="loading loading-spinner loading-md"></span>:<button className="btn btn-info bg-button text-legacyBlue" onClick={add_Multiple}>
        Add benificary
      </button>}
      {alert.visible && (
        <div role="alert" className={`alert alert-${alert.type}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={alert.type === 'success' ? 'M9 12l2 2l4-4m0 4l-4-4m7 4a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'} />
          </svg>
          <span>{alert.message}</span>
        </div>
      )}
    </div>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-info bg-button text-legacyBlue" onClick={cleanStatus}>Close</button>
      </form>
    </div>
  </div>
</dialog>
    </div>
  </div>
)};

export default AddAsset;
