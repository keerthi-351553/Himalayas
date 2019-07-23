'use strict';
const logger = require('./../../applogger');
const {user} = require('./userEntity');
var login = (req, res) => {
  let username = req.body.username;
  let passwd = req.body.password;
  user.findOne({Username:username}).then((docs) => {
    if(docs != null){
      if(docs.Password == passwd) {
        res.send(docs);
      }else{
        res.send("password_mismatch");
      }
    }else{res.send("invalid_data");}
  }, (err) => {
    res.send("invalid_data");
  });
};


let addUser = (req, res) => {
  let newUser = new user({
    Username : req.body.username,
    Password : req.body.password,
    Loginid : req.body.loginid,
    Role : req.body.role
  });
  newUser.save().then((docs) => {
    logger.debug(docs);
    res.send(docs);
  }, (err) => {
    res.status(400).send(err);
    logger.debug('error occurred while adding');
  });
};

let viewUser =(req, res) => {
  user.find({Username:req.body.Username}).then((docs) => {
    res.send(docs);
  });
};
let userPasswordChange =(req,res)=>
{
  var Loginid = req.body.PhleboID;
  user.find({Loginid:req.body.Loginid}).then((docs)=>
{
  res.send(docs);
});
};

let ChangePassword=(req,res) => {
  let data = req.body;
  user.update({'Username':data.Username},
    {'$set': {
      'Password': req.body.newPassword
    }},function(err){
      if (err) {
           res.send(err);
         } else {
           res.send('success');
         }
       }
     );
}
module.exports = {
  login,
  addUser,
  viewUser,
  ChangePassword,
  userPasswordChange
};
