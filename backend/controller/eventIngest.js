const eventService = require('../services/eventIngest')

module.exports ={
    addAsset:async(req,res)=>{
        const result = eventService.addAsset(req.data)
        res.send(req.data)
    },

    claimAsset:async(req,res)=>{

    },
}