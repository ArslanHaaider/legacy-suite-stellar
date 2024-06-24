const { sign } = require("crypto");
const adminSign = require("../controller/adminSign");
const { Keypair, SorobanRpc,TransactionBuilder,Contract ,BASE_FEE,Networks,xdr} = require('@stellar/stellar-sdk')
module.exports = {
    adminSign: async(req,res)=>{
        try{
            const adminKeyPair =  Keypair.fromSecret("SBI5Z6W3KXYQ4Z556WB77E5DWUQGQHZWV37BGMF2BBWQWO4ERULIGK5J");
            const server = new SorobanRpc.Server(
                "https://soroban-testnet.stellar.org:443",
              );
            
              // Here we will use a deployed instance of the `increment` example contract.
              const contractAddress =
                "CDBOZEPIDZGWN3TUJLJKFBZLFN6TKYYJGKUKWTTAXC4IEMTO6SAK6JF2";
              const contract = new Contract(contractAddress);
            
              // Transactions require a valid sequence number (which varies from one
              // account to another). We fetch this sequence number from the RPC server.
              const sourceAccount = await server.getAccount(adminKeyPair.publicKey());
            
              // The transaction begins as pretty standard. The source account, minimum
              // fee, and network passphrase are provided.
              let builtTransaction = new TransactionBuilder(sourceAccount, {
                fee: BASE_FEE,
                networkPassphrase: Networks.TESTNET,
              })
                // The invocation of the `increment` function of our contract is added
                // to the transaction. Note: `increment` doesn't require any parameters,
                // but many contract functions do. You would need to provide those here.
                .addOperation(contract.call("test_admin_sign"))
                // This transaction will be valid for the next 30 seconds
                .setTimeout(30)
                .build();
            
            //   console.log(`builtTransaction=${builtTransaction.toXDR()}`);
            
              // We use the RPC server to "prepare" the transaction. This simulating the
              // transaction, discovering the storage footprint, and updating the
              // transaction to include that footprint. If you know the footprint ahead of
              // time, you could manually use `addFootprint` and skip this step.
              let preparedTransaction = await server.prepareTransaction(builtTransaction);
            
              // Sign the transaction with the source account's keypair.
           preparedTransaction.sign(adminKeyPair);
            const txEnvelope =  xdr.TransactionEnvelope.fromXDR(preparedTransaction.toXDR(), "base64");
              let signature = txEnvelope.v1().signatures()[0].signature();
            // console.log(signature)
              return [preparedTransaction.hash(),signature,adminKeyPair.publicKey().toString()]
              
        }catch(err){
            console.log("getting error in service")
            return "Error Found in (services/adminSign)" + err
        }
    }
}