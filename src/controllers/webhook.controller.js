const {Walett} = require("../models/walett.model")
const {Transaction} = require("../models/transaction.model")

exports.webhook = async function(req,res){
    const payload = req.body;
    if (payload.event === "charge.completed") {
        const walett = await Walett.findOne({user_id:payload.data.tx_ref});
               
        if (payload.data.status === 'successful') {
            console.log(payload);
            const amount = payload.data.amount - payload.data.app_fee
            const walettBalance = walett.balance + amount
            walett.balance = walettBalance
            await walett.save();

            const detail = {
                user_id:payload.data.tx_ref,
                flw_tran_id:payload.data.flw_ref,
                amount:(payload.data.amount + payload.data.app_fee).toFixed(2),
                type:"Credit",
                balance:(walett.balance).toFixed(2),
                status: payload.data.status
            }

         await Transaction.create(detail);

            return res.status(200).json({msg:"wallet updated Succesfully"});
        } else {
            console.log(payload)
            return res.status(200).send("webhook received")
        }
    } else {
        return res.status(200).send("webhook received");
    }
}