const {Transaction} = require("../models/transaction.model");

exports.webhook = async function(req,res){
    const payload = req.body;
    switch (payload.event) {
        case "charge.completed":
            let transaction = await Transaction.findById(payload.data.tx_ref);
            let fee = await getChargeFee(transaction.amount, result.data.currency);
            let amount = transaction.amount + fee;
            switch (payload.data.status) {
                case "successful":
                    console.log(payload);
                    if (transaction.status ==="successful"){
                        return res.status(200).json({msg:"payment successful"});
                    }else if(payload.data.amount===amount && transaction.currency===payload.data.currency){
                        transaction.status = "successful";
                        transaction.save();
                        return res.status(200).json({msg:"payment successful"});
                    }
                    break;
                case "failed":
                    console.log(payload)
                    if(transaction.status === "failed"){
                        return res.status(200).send("webhook received")
                    }else if(payload.data.amount === amount && transaction.currency===payload.data.currency){
                        transaction.status = "failed";
                        transaction.save();
                        return res.status(200).send("webhook received");
                    }
                    break;
                default:
                    return res.status(200).send("webhook received");
                    break;
            }
            break;
    
        default:
            return res.status(200).send("webhook received");
            break;
    }
}