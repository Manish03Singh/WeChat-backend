const User = require('../model/userModel')
const bcrypt = require('bcrypt')

module.exports.register = async(req, res, next) =>{
    try{
        const {username, email, password} = req.body;
        const userNameCheck = await User.findOne({username});
        if(userNameCheck){
            return res.json({msg : `User name is already used`, status : false});
        }
        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg : `Email is already used`, status : false});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email, username, password : hashPassword
        });
        user.password = "";
        return res.json({status : true, user, msg : `Successfully Registered`})
    } catch(err){
        next(err);
    }

}

module.exports.login = async(req, res, next) =>{
    try{
        const {username, password} = req.body;
        const userCheck = await User.findOne({username});
        if(!userCheck){
            return res.json({msg : `Username doesn't Exist`, status : false});
        }

        const passwordCheck = await bcrypt.compare(password, userCheck.password);
        if(!passwordCheck){
            return res.json({msg : `Wrong Password!!!`, status : false});
        }
        userCheck.password = "";
        return res.json({status : true, user : userCheck, msg : `Successfully Loggedin`})
    } catch(err){
        next(err);
    }

}

module.exports.setAvatar = async(req, res, next) =>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarSet : true,
            avatarImage,
        })
        return res.json({
            isSet : true, 
            isAvatarSet : userData.isAvatarSet,
            avatarImage : userData.avatarImage,
        })
    } catch(err){
        next(err);
    }

}

module.exports.allusers = async(req, res, next) =>{
    try{
        //console.log(req.params)
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
          ]);

          return res.json(users);
    } catch(err){
        next(err);
    }

}