const adminSignature = require("../services/adminSign")

module.exports = {
    adminSign: async(req,res)=>{
        try{
            const data = await adminSignature.adminSign();
            res.send(data)  
        }catch(err){
            console.log("Error (controller/adminSign):"+err);
        }
    }
}