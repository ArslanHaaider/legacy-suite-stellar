const { Keypair, SorobanRpc,TransactionBuilder,Contract ,BASE_FEE,Networks,xdr} = require('@stellar/stellar-sdk')
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const adminRoute = require("./routes/adminSign")
const eventIngestRoute = require('./routes/eventsIngest')

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors({
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
app.use('/event',eventIngestRoute)
app.use("/admin",adminRoute)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
