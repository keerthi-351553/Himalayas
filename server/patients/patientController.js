'use strict';
const logger = require('./../../applogger');
const {patient} = require('./patientEntity');
const {user} = require('../users/userEntity');
const {phlebo} = require('../phlebotomist/phlebotomistEntity');

//  @Mayanka: adding patients to both users and patients schema
let addPatient = (req, res) => {
let newPatient = new patient({
  PatientID: req.body.PatientID,
  FirstName : req.body.FirstName,
  LastName: req.body.LastName,
  Age : req.body.Age,
  DateOfBirth: req.body.DateOfBirth,
  Gender: req.body.Gender,
  Address: req.body.Address,
  ContactNumber: req.body.ContactNumber,
  ProfilePhoto:req.body.ProfilePhoto
});
let newUser = new user({
  Username : req.body.PatientID,
  Password : 'max@123',
  Loginid : req.body.PatientID,
  Role : 'PA',
  EmailId:req.body.Email
});
newPatient.save().then((docs) => {
  res.send(docs);
}, (err) => {
  res.status(400).send(err);
  logger.debug('error occurred while adding');
});
newUser.save().then((docs) => {
  logger.debug(docs);
  res.send(docs);
}, (err) => {
  res.status(400).send(err);
  logger.debug('error occurred while adding');
});
};


let  addAppointment = (req, res) => {
  let PatientID = req.body.PatientID;
  let AppointmentID =  req.body.AppointmentID;
  let PreferredTime =  req.body.PreferredTime;
  let PreferredDate = req.body.PreferredDate;
  patient.findOneAndUpdate({
    'PatientID' : PatientID
  }, {
    $push: {
      AppointmentRecord: {
        AppointmentID: AppointmentID,
        PreferredDate: PreferredDate,
        PreferredTime: PreferredTime
      }
    }
  },function(err) {
    if (err) {
    res.send(err);
  } else {
    res.send('sucess');
  }
});
};

let viewPatients =  (req, res) => {
  patient.find().then((docs) => {
    res.send(docs);
  });
};

let viewPatientWithId = (req, res) => {
  patient.find({PatientID:req.body.PatientID}).then((docs) => {
    res.send(docs);
  });
};

let viewAppointment = (req,res) => {
  var PatientID = req.body.pid;
  patient.find({PatientID: PatientID}).then((docs) => {
    res.send(docs);
  }, (err) => {
    res.send('Cant get the docs', err);
  });
};

let scheduleAppointment = (req, res) => {
  var PatientID = req.body.pid;
  var AppointmentID = req.body.aid;
  var date = req.body.date;
  var time = req.body.time;

  patient.findOneAndUpdate({
    'PatientID': PatientID
  }, {
    '$push': {
      AppointmentRecord: {
        AppointmentID:AppointmentID,
        'PreferredDate': date,
        'PreferredTime': time
      }
    }
  }, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({message: 'User updated successfully'});
    }
  });
};

let viewParticularAppointment = (req, res) => {
  var PatientID = req.body.pid;
  var AppointmentID = req.body.aid;

  patient.find({PatientID: PatientID,"AppointmentRecord.AppointmentID":AppointmentID}).then((docs) => {

    res.send(docs);
  }, (err) => {
    res.send('Cant get the docs', err);
  });
}
let reScheduleAppointment = (req, res) => {
  var PatientID = req.body.pid;
  var AppointmentID = req.body.aid;
  var phid = req.body.phid;
  var date = req.body.date;
  var time = req.body.time;
  patient.update({
    'PatientID': PatientID,
    'AppointmentRecord.AppointmentID': AppointmentID
  }, {
    $set: {
      'AppointmentRecord.$.PreferredDate': date,
      'AppointmentRecord.$.PreferredTime': time,
      'AppointmentRecord.$.Status':'Unassigned',
      'AppointmentRecord.$.AssignedPhelbo.ID':'',
      'AppointmentRecord.$.AssignedPhelbo.Name':'',
      'AppointmentRecord.$.AssignedPhelbo.CheckIn':'',
      'AppointmentRecord.$.AssignedPhelbo.CheckOut':''
    }
  }, function(err) {
    if (err) {
      res.send(err);
    }  else {
      if(phid != '' && phid != undefined){
        phlebo.find({'PhleboID':phid}).then((docs) => {
          docs[0].AllocationStatus.map((item)=>{
            if(item.Slot1.AppointmentID == AppointmentID && item.Slot1.PatientID ==PatientID) {
              item.Slot1.Status = "";
              item.Slot1.Test = "";
              item.Slot1.PatientID = "";
              item.Slot1.AppointmentID = "";
            }
            else if(item.Slot2.AppointmentID == AppointmentID && item.Slot2.PatientID == PatientID) {
              item.Slot2.Status = "";
              item.Slot2.Test = "";
              item.Slot2.PatientID = "";
              item.Slot2.AppointmentID = "";
            }
            else if(item.Slot3.AppointmentID == AppointmentID && item.Slot3.PatientID == PatientID) {
              item.Slot3.Status = "";
              item.Slot3.Test = "";
              item.Slot3.PatientID = "";
              item.Slot3.AppointmentID = "";
            }
            else if(item.Slot4.AppointmentID == AppointmentID && item.Slot4.PatientID == PatientID) {
              item.Slot4.Status = "";
              item.Slot4.Test = "";
              item.Slot4.PatientID = "";
              item.Slot4.AppointmentID = "";
            }
          });
          docs[0].save(function(err) {
            if (err)
            throw err;
            else {
              res.send("success");
            }
          });
        });
      }
      else{
        res.send("success");
      }
    }
  });
};

let cancelAppointment = (req, res) => {
  var pid = req.body.pid;
  var aid = req.body.aid;
  var phid = req.body.phid;

  patient.update({
    'PatientID': pid,
    'AppointmentRecord.AppointmentID': aid
  }, {
    $set: {
      'AppointmentRecord.$.Status':'Cancelled'
    }
  }, function(err) {
    if (err) {
    res.send(err);
  } else {
    if(phid != '' && phid != undefined){
      phlebo.find({'PhleboID':phid}).then((docs) => {
        docs[0].AllocationStatus.map((item)=>{
          if(item.Slot1.AppointmentID == aid && item.Slot1.PatientID ==pid) {
            item.Slot1.Status = "";
            item.Slot1.Test = "";
            item.Slot1.PatientID = "";
            item.Slot1.AppointmentID = "";
          }
          else if(item.Slot2.AppointmentID == aid && item.Slot2.PatientID == pid) {
            item.Slot2.Status = "";
            item.Slot2.Test = "";
            item.Slot2.PatientID = "";
            item.Slot2.AppointmentID = "";
          }
          else if(item.Slot3.AppointmentID == aid && item.Slot3.PatientID == pid) {
            item.Slot3.Status = "";
            item.Slot3.Test = "";
            item.Slot3.PatientID = "";
            item.Slot3.AppointmentID = "";
          }
          else if(item.Slot4.AppointmentID == aid && item.Slot4.PatientID == pid) {
            item.Slot4.Status = "";
            item.Slot4.Test = "";
            item.Slot4.PatientID = "";
            item.Slot4.AppointmentID = "";
          }
        });
        docs[0].save(function(err) {
          if (err)
          throw err;
          else {
            res.send("success");
          }
        });
      });
    }
    else{
      res.send("success");
    }
  }
});
};

let editProfile = (req, res) => {
  var PatientID = req.body.pid;
  patient.update({
    'PatientID': PatientID
  }, {
    $set: {
      'FirstName': req.body.FirstName,
      'LastName': req.body.LastName,
      'DateOfBirth': req.body.DateOfBirth,
      'ContactNumber': req.body.ContactNumber,
      'Gender': req.body.Gender,
      'Address': req.body.Address
    }
  }, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({message: 'User updated successfully'});
    }
  });
};

let sendMessage = (req, res) => {
  var PatientID = req.body.pid;
  patient.update({
    'PatientID': PatientID
  }, {
    $set: {
      'Message': req.body.Message
    }
  }, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({message: 'User updated successfully'});
    }
  });
};

module.exports = {
  addPatient,
  addAppointment,
  viewPatients,
  viewPatientWithId,
  viewAppointment,
  reScheduleAppointment,
  scheduleAppointment,
  cancelAppointment,
  editProfile,
  viewParticularAppointment,
  sendMessage
};
