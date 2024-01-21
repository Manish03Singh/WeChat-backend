const messageModel = require('../model/messageModel');


module.exports.addMessage = async(req, res, next) => {
    try{
        const {from, to, msg} = req.body;
        const data = await messageModel.create({
            message : {text : msg},
            users : [from,to],
            sender : from,
        })
        if(data) 
            return res.json({status : true, msg : `Data added successfully`})
        else    
            return res.json({status:false, msg : `Failed to add message to database`})
    } catch(err){
        next(err)
    }
}

module.exports.getAllMessage = async(req, res, next) => {
    try{
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users : {
                $all: [from, to],
            }
        }).sort({updatedAt : 1});

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        
        res.json(projectedMessages);
    } catch(err){
        next(err)
    }
}