import { getPublicKey, signTransaction } from "@stellar/freighter-api";

import {
  Address,
  rpc,
  scValToNative,
  xdr,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  SorobanRpc,
  Transaction,
  Keypair,
  Account,
  Contract,
  Asset,
  Operation,
  Horizon
} from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";
import { legacyContract } from "../../contractClass";
import axios from "axios";
import { AssetMap } from "../utility/assetMap";
import { AssetType, Codes, ValueItem } from "./types/benificiary";
import { resolve } from "path";
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
const UnClaimed = () => {
  let data;
  const [loading, setLoading] = useState(false);
  const [loading2,setLoading2] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });
  let [values, setValues] = useState<AssetType[]>([]);
  const [assetCodes, setAssetCodes] = useState<Codes>({});
  const [assetCodes2, setAssetCodes2] = useState<Codes>({});
  const [balance,setBalance ] = useState<Array<Balance>>();
  useEffect(() => {
    const accountInfo = async () => {
      const server = new Horizon.Server("https://horizon-testnet.stellar.org/", {
      });
      const publicKey = await getPublicKey();
      let data  = await server.loadAccount(publicKey);
      // let amountLimit = parseInt(account.balances[0].balance);
      // console.log(account.balances);
      console.log("printing balances",data.balances)
      // @ts-ignore
      setBalance(data.balances);
      // console.log(process.env.CONTRACTADDRESS)
    };
    accountInfo();
  }, []);
  useEffect(() => {
    const fetchAssets = async () => {
      const server = new rpc.Server("https://soroban-testnet.stellar.org:443", {
        allowHttp: true,
      });
      const publicKey = await getPublicKey();
      const address = new Address(publicKey).toScAddress();
      const key = xdr.ScVal.scvSymbol("BENI");
      data = await server.getContractData(
        import.meta.env.VITE_CONTRACTADDRESS,
        key
      );
      let value = scValToNative(data.val.contractData().val());
      value = value[publicKey];
      const result = value.map((item: ValueItem) => ({
        token: item[0],
        from: item[1],
        value: item[2],
        claimed: item[3],
      }));
      console.log("printing value",value);
      setValues(result);
      console.log(result);
    };
    fetchAssets();
    // console.log(values[]);
  }, []);

  useEffect(() => {
    const fetchAssetCodes = async () => {
      setLoading(true);
      setLoading2(true)
      const codes: Codes = {};
      const codes2: Codes = {};
      for (const asset of values) {
        const code = await getAssetCode(asset.token);
        codes[asset.token] = code[0] === "native" ? "XLM" : code[0];
        if (code[0] !== "native" && !asset.claimed) {
          codes2[code[1]] = code[0];
        }
      }
      setAssetCodes2(codes2);
      console.log("printing codes2",codes2);
      setAssetCodes(codes);
      console.log("printing codes",codes)
      setLoading(false);
      setLoading2(false)
      // console.log(loading);
    };

    if (values.length > 0) {
      fetchAssetCodes();
    }
  }, [values]);
  //getting the asset code of the SAC:
  const getAssetCode = async (asset_Contract: string) => {
    let asset_code,
      asset_issuer = "";
    let asset: Asset;

    const asset_contract = asset_Contract;
    const network = Networks.TESTNET;
    const rpc = "https://soroban-testnet.stellar.org";

    try {
      let server = new SorobanRpc.Server(rpc, { allowHttp: true });
      let dummy_wallet = Keypair.random().publicKey();
      let account = new Account(dummy_wallet, "0");
      let tx = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: network,
      })
        .addOperation(new Contract(asset_contract).call("name"))
        .setTimeout(180)
        .build();
      let sim = await server.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
        let asset_string = scValToNative(sim.result.retval);

        if (asset_string == "native") {
          asset_code = asset_string;
          asset = Asset.native();
        } else {
          [asset_code, asset_issuer] = asset_string.split(":");
          asset = new Asset(asset_code, asset_issuer);
        }

        if (asset.contractId(network) != asset_contract) {
          asset_issuer = "";
          asset_code = "";
        }
      }
    } catch (e) {}

    // AQUA GAHPYWLK6YRN7CVYZOO4H3VDRZ7PVF5UJGLZCSPAEIKJE2XSWF5LAGER
    // console.log([asset_code,asset_issuer])
    return [asset_code, asset_issuer];
  };

  const getAdminData = async () => {
    try {
      const adminData = await axios.get("/admin/Sign", {
        baseURL:import.meta.env.VITE_BACKEND,
      });
      // console.log(adminData.data);
      return adminData.data;
    } catch (e) {
      console.log("Error in (getAdminDataFunc):" + e);
    }
  };

  //claim function:
  const claimAsset = async (userAddress: string) => {
    setLoading(true);
    let publicKey = await getPublicKey();
    const contractAddress = import.meta.env.VITE_CONTRACTADDRESS;
    const benificiaryAccount = new Address(publicKey);
    const server = new SorobanRpc.Server(
      "https://soroban-testnet.stellar.org:443",
      {
        allowHttp: true,
      }
    );
    const adminData = await getAdminData();
    // console.log(adminData);
    const Adminaddress = new Address(adminData[2]).toBuffer();
    const messageHash = adminData[0];
    const signatures = adminData[1];
    console.log(
      new Address(userAddress),
      benificiaryAccount,
      new Uint8Array(messageHash.data),
      Adminaddress,
      signatures.data
    );
    const myContract = new legacyContract(contractAddress);
    const operation = myContract.claim_asset(
      new Address(userAddress),
      benificiaryAccount,
      new Uint8Array(messageHash.data),
      Adminaddress,
      new Uint8Array(signatures.data)
    );
    const sourceAccount = await server.getAccount(publicKey);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let keys in assetCodes2) {
      let trustExist = balance.some(balance => balance.asset_code == assetCodes2[keys]);
      console.log("Priting the value of the trust exist",trustExist,keys)
      if(!trustExist){
        const newAsset = new Asset(assetCodes2[keys], keys);
        let trustLineTransaction = new TransactionBuilder(sourceAccount, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(
            Operation.changeTrust({
              asset: newAsset,
              source: sourceAccount.accountId(),
            })
          )
          .setTimeout(300)
          .build();
        const transaction = await signTransaction(
          trustLineTransaction.toEnvelope().toXDR("base64"),
          {
            networkPassphrase: Networks.TESTNET,
          }
        );
        const txEnvelope = xdr.TransactionEnvelope.fromXDR(transaction, "base64");
        const send = await server.sendTransaction(
          new Transaction(txEnvelope, Networks.TESTNET)
        );
        await delay(4000);
      } 
      else{
        console.log("trutline already exist");
      }
    }

    try {
      const builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,  
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();
      console.log("before simu");
      const simulatedTx = await server.simulateTransaction(builtTransaction);
      console.log("before assebmled");
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
      console.log(txEnvelope.toXDR("base64"));
      const send = await server.sendTransaction(
        new Transaction(txEnvelope, Networks.TESTNET)
      );
      console.log(send.hash);
      setTimeout(async()=>{
        const Result = await server.getTransaction(send.hash);
      if(Result.status == "SUCCESS"){
      setLoading(false);
        setAlert({
          visible: true,
          type: "Success",
          message: "You transacton was successfull.",
        });
      }
      else{
        console.log(Result.status);
        setLoading(false);
        setAlert({
          visible: true,
          type: "error",
          message: "Error! Your transaction failed.",
        });
      }
      },6000)
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({
        visible: true,
        type: "error",
        message: "Error! Your transaction failed.",
      });
    }
  };

  const groupedByAddress =
    values.length > 0
      ? values.reduce<{ [key: string]: AssetType[] }>((acc, asset) => {
          if (!acc[asset.from]) {
            acc[asset.from] = [];
          }
          acc[asset.from].push(asset);
          return acc;
        }, {})
      : {};

  const unClaimed = Object.values(groupedByAddress);
  // console.log(unClaimed[1], "Printing unclaimed setting");
  return (
    <>
      <div className="min-h-screen flex bg-[#ffff] font-sans">
        <>
          <div className="w-full flex-col flex">
            <h1 className="text-center font-bold text-2xl mt-4 text-legacyBlue">
              Unclaimed Assets
            </h1>
            <div>
              {unClaimed.length > 0 ? (
                unClaimed.map((assets, index) => (
                  <div key={index} className="address-group card ">
                    {assets.some((asset: AssetType) => !asset.claimed) && (
                      <div className="  w-9/12 mt-4 card-body border border-[#EFF0F1] ml-5 rounded-md text-[#1D232A] font-mono bg-[#FDFDFD]">
                        <div className=" text-2xl font-medium bg-[#ffff]">
                          You have unclaimed Assets from <br />
                          <mark>{assets[0].from}</mark>
                        </div>
                        <div className=" text-sm bg-[#ffff]">
                          {assets.map(
                            (asset, id) =>
                              !asset.claimed && (
                                <div key={id} className="unclaimed-asset flex">
                                  {loading2 ? (
                                    "Loading..."
                                  ) : (
                                    <>
                                      <img
                                        width={50}
                                        src={
                                          assetCodes[asset.token] == "XLM"
                                            ? AssetMap["native"]?.image
                                            : AssetMap[assetCodes[asset.token]]
                                                ?.image
                                        }
                                        alt={asset.token}
                                      />
                                      <div className="text-lg">
                                        <p>
                                          Token:
                                          {loading2
                                            ? "Loading ..."
                                            : [assetCodes[asset.token]]}
                                        </p>
                                        <p>
                                          Amount:{" "}
                                          {Number(asset.value) / 10000000}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )
                          )}

                          {loading ? (
                            <span className="loading loading-spinner loading-md"></span>
                          ) : (
                            <button
                              className="btn btn-info bg-button text-legacyBlue mt-2"
                              onClick={() => {
                                claimAsset(assets[0].from);
                              }}
                            >
                              Claim
                            </button>
                          )}
                          {alert.visible && (
                            <div
                              role="alert"
                              className={`alert alert-${alert.type}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d={
                                    alert.type === "success"
                                      ? "M9 12l2 2l4-4m0 4l-4-4m7 4a9 9 0 11-18 0 9 9 0 0118 0z"
                                      : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  }
                                />
                              </svg>
                              <span>{alert.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <h1>No unclaimed Assets found</h1>
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
};
export default UnClaimed;
