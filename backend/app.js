const { Keypair, SorobanRpc,TransactionBuilder,Contract ,BASE_FEE,Networks,xdr} = require('@stellar/stellar-sdk')
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const adminRoute = require("./routes/adminSign")
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors({
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  
app.use("/admin",adminRoute)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// const adminSign = async()=>{
//     try{
//         const adminKeyPair =  Keypair.fromSecret("SBI5Z6W3KXYQ4Z556WB77E5DWUQGQHZWV37BGMF2BBWQWO4ERULIGK5J");

//         const server = new SorobanRpc.Server(
//             "https://soroban-testnet.stellar.org:443",
//           );
        
//           // Here we will use a deployed instance of the `increment` example contract.
//           const contractAddress =
//             "CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2";
//           const contract = new Contract(contractAddress);
        
//           // Transactions require a valid sequence number (which varies from one
//           // account to another). We fetch this sequence number from the RPC server.
//           const sourceAccount = await server.getAccount(adminKeyPair.publicKey());
        
//           // The transaction begins as pretty standard. The source account, minimum
//           // fee, and network passphrase are provided.
//           let builtTransaction = new TransactionBuilder(sourceAccount, {
//             fee: BASE_FEE,
//             networkPassphrase: Networks.TESTNET,
//           })
//             // The invocation of the `increment` function of our contract is added
//             // to the transaction. Note: `increment` doesn't require any parameters,
//             // but many contract functions do. You would need to provide those here.
//             .addOperation(contract.call("test_admin_sign"))
//             // This transaction will be valid for the next 30 seconds
//             .setTimeout(30)
//             .build();
        
//           console.log(`builtTransaction=${builtTransaction.toXDR()}`);
        
//           // We use the RPC server to "prepare" the transaction. This simulating the
//           // transaction, discovering the storage footprint, and updating the
//           // transaction to include that footprint. If you know the footprint ahead of
//           // time, you could manually use `addFootprint` and skip this step.
//           let preparedTransaction = await server.prepareTransaction(builtTransaction);
        
//           // Sign the transaction with the source account's keypair.
//           preparedTransaction.sign(adminKeyPair);
//           console.log("printing transaction" + preparedTransaction)
//         const txEnvelope = xdr.TransactionEnvelope.fromXDR(preparedTransaction.toXDR(), "base64");
//         console.log(txEnvelope)
//           let signature = txEnvelope.v1().signatures();
//           console.log(signature)
//           console.log(txEnvelope)
//         // console.log("returnign values")
//           return [preparedTransaction.hash(),signature,adminKeyPair.publicKey()]
//     }catch(err){
//         console.log("getting error in service")
//         return "Error Found in (services/adminSign)" + err
//     }
// }

// adminSign()