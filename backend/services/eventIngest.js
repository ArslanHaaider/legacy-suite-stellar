const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


module.exports ={
    addAsset:async(req,res)=>{
        try{    
            prisma.sorobanEvent.create({
                data:{
                    ledger:req.data.ledger,  
                    contract_id:req.data.contractId, 
                    topic:req.data.topic,   
                    willWriterAddress:req.data.willWriterAddress,    
                    benificiaryAddress:req.data.benificiaryAddress,     
                    claimed:req.data.claimed,    
                    amount:req.data.amount,       
                }
            })
        }
        catch{

        }
    },
    claimAsset:async(req,res)=>{

    },
}