import { useState, useEffect } from "react";
import {
  rpc,
  scValToNative,
  xdr,
  TransactionBuilder,
  Networks,
  SorobanRpc,
  Keypair,
  Account,
  Contract,
  Asset,
} from "@stellar/stellar-sdk";
import { getPublicKey } from "@stellar/freighter-api";
import { AssetMap } from "../assetMap";
import { ValueItem, AssetType, Codes } from "./types/benificiary";
const Claimed = () => {
  let data;

  const [loading, setLoading] = useState(false);
  let [values, setValues] = useState<AssetType[]>([]);
  const [assetCodes, setAssetCodes] = useState<Codes>({});
  useEffect(() => {
    const fetchAssets = async () => {
      const server = new rpc.Server("https://soroban-testnet.stellar.org:443", {
        allowHttp: true,
      });
      const publicKey = await getPublicKey();
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
      setValues(result);
    };
    fetchAssets();
    // console.log(values[]);
  }, []);
  useEffect(() => {
    const fetchAssetCodes = async () => {
      try {
        setLoading(true);
        const codes: Codes = {};
        const codes2: Codes = {};
        for (const asset of values) {
          const code = await getAssetCode(asset.token);
          codes[asset.token] = code[0] === "native" ? "XLM" : code[0];
          if (code[0] !== "native" && !asset.claimed) {
            codes2[code[1]] = code[0];
          }
        }
        // console.log(codes2);
        setAssetCodes(codes);
        // console.log(codes,"printing assetCOds");
        // console.log(loading);
      } finally {
        setLoading(false);
      }
    };

    if (values.length > 0) {
      fetchAssetCodes();
    }

    // console.log(AssetMap[assetCodes[asset.token]]);
  }, [values]);

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

  return (
    <>
      <div className="w-full h-full flex-col bg-[#ffff]  ">
        <h1 className="text-center font-bold text-2xl mt-4 text-legacyBlue font-sans  ">
          Claimed Assets
        </h1>

        {values.length > 0 ? (
          values.map((asset: AssetType) => {
            // console.log(asset?.token,"printing each token address")
            return (
              <>
                {asset.claimed && (
                  <div className="collapse collapse-arrow   w-11/12 ml-2 bg-[#ffff] text-[#1D232A] ">
                    <div className="border border-[#EFF0F1]  min-h-40 items-center w-11/12 ml-4 mb-3 bg-[#FDFDFD] rounded-md font-mono p-4">
                      <p className="collapse-title  text-2xl p-3 ml-5 bg-[#ffff]">
                        Will Owner: <mark>{asset.from}</mark>
                      </p>
                      <div className="ml-8 flex">
                        {loading ? (
                          "Loading... "
                        ) : (
                          <img
                            src={
                              assetCodes[asset.token] == "XLM"
                                ? AssetMap["native"]?.image
                                : AssetMap[assetCodes[asset.token]]?.image
                            }
                            alt="didn't found"
                            width={30}
                            className="mt-30"
                          />
                        )}
                        <div className="ml-4 text-lg">
                          <p>
                            Asset:
                            {loading ? "Loading... " : assetCodes[asset.token]}
                          </p>
                          <span>Amount:{Number(asset.value) / 10000000}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })
        ) : (
          <h1>No claimed Asset Found</h1>
        )}
      </div>
    </>
  );
};

export default Claimed;
