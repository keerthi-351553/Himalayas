const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  Username : String,
  Password : String,
  Loginid : String,
  Role : String,
  EmailId: String
});

let user = mongoose.model('usercredentials', schema);

module.exports = {
  user : user
}
