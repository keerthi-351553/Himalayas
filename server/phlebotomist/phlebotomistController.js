'use strict';
const logger = require('./../../applogger');
const {phlebo} = require('./phlebotomistEntity');
const {user} = require('../users/userEntity');
const {patient} = require('../patients/patientEntity');

let addPhlebo = (req, res) => {
  let newphlebo = new phlebo({
    PhleboID : req.body.PhelboID,
    FirstName : req.body.FirstName,
    LastName : req.body.LastName,
    Age : req.body.Age,
    DateOfBirth:req.body.DateOfBirth,
    Gender : req.body.Gender,
    Address : req.body.Address,
    ContactNumber : req.body.ContactNumber,
    ProfilePhoto: req.body.ProfilePhoto,
    AllocationStatus:[
      {
          Date: req.body.d1,
          Slot1: {
            Time:'09:00-11:00',
            AppointmentID:req.body.sl1Ap1,
            PatientID:req.body.sl1pa1,
            Test:'Blood',
            Status:'Assigned',
            CheckIn:'',
            CheckOut:''
          },
          Slot2: {
            Time:'11:00-13:00',
            AppointmentID:req.body.sl2Ap2,
            PatientID:req.body.sl2pa2,
            Test:'Blood',
            Status:'Assigned',
            CheckIn:'',
            CheckOut:''
          },
          Slot3: {
            Time:'14:00-16:00',
            AppointmentID:req.body.sl3Ap3,
            PatientID:req.body.sl3pa3,
            Test:'Blood',
            Status:'Assigned',
            CheckIn:'',
            CheckOut:''
          },
          Slot4: {
            Time:'16:00-18:00',
            AppointmentID:req.body.sl4Ap4,
            PatientID:req.body.sl4pa4,
            Test:'Blood',
            Status:'Assigned',
            CheckIn:'',
            CheckOut:''
          }
      }
    ]
  });

newphlebo.save().then((docs) => {
    logger.debug(docs);
    res.send(docs);
  }, (err) => {
    res.status(400).send(err);
    logger.debug('error occurred while adding');
  });
};
let viewPhlebo =  (req, res) => {
  phlebo.find().then((docs) => {
    res.send(docs);
  });
};

let viewPhleboWithId =(req,res) =>{
  var PhleboID=req.body.PhleboID;
  phlebo.find({PhleboID:req.body.PhleboID}).then((docs)=>
{
  res.send(docs);
});
};

let viewPhleboAppointments =  (req, res) => {
  var arr = [];
  var out= [];
  // var out1= [];
  phlebo.find({PhleboID:req.body.PhleboID}).then((docs) => {
    docs[0].AllocationStatus.map((item)=>{
      arr.push(item.Slot1.PatientID);
      arr.push(item.Slot2.PatientID);
      arr.push(item.Slot3.PatientID);
      arr.push(item.Slot4.PatientID);
    });
    res.send(arr);
  });
};

let addFeedback = (req, res) => {
  var PhleboID = req.body.phid;
  var PatientID = req.body.pid;
  var date = req.body.date;
  var appointmentID = req.body.aid;
  var question1 =req.body.question1;
  var question2 =req.body.question2;
  var question3 =req.body.question3;
  var question4 =req.body.question4;
  var question5 =req.body.question5;
  var rating =req.body.rating;
  phlebo.find({'PhleboID':PhleboID}).then((docs) => {
    docs[0].AllocationStatus.map((item)=>{
      if(item.Date == date) {
        if(item.Slot1.AppointmentID == appointmentID) {
            item.Slot1.Feedback.Question1 = question1;
            item.Slot1.Feedback.Question2 = question2;
            item.Slot1.Feedback.Question3 = question3;
            item.Slot1.Feedback.Question4 = question4;
            item.Slot1.Feedback.Question5 = question5;
            item.Slot1.Feedback.Rating = rating;
        }
        else if(item.Slot2.AppointmentID == appointmentID) {
          item.Slot2.Feedback.Question1 = question1;
          item.Slot2.Feedback.Question2 = question2;
          item.Slot2.Feedback.Question3 = question3;
          item.Slot2.Feedback.Question4 = question4;
          item.Slot2.Feedback.Question5 = question5;
          item.Slot2.Feedback.Rating = rating;
        }
        else if(item.Slot3.AppointmentID == appointmentID) {
          item.Slot3.Feedback.Question1 = question1;
          item.Slot3.Feedback.Question2 = question2;
          item.Slot3.Feedback.Question3 = question3;
          item.Slot3.Feedback.Question4 = question4;
          item.Slot3.Feedback.Question5 = question5;
          item.Slot3.Feedback.Rating = rating;
        }
        else if(item.Slot4.AppointmentID == appointmentID ) {
          item.Slot4.Feedback.Question1 = question1;
          item.Slot4.Feedback.Question2 = question2;
          item.Slot4.Feedback.Question3 = question3;
          item.Slot4.Feedback.Question4 = question4;
          item.Slot4.Feedback.Question5 = question5;
          item.Slot4.Feedback.Rating = rating;
        }
      }
    });
    docs[0].save(function(err) {
      if (err)
        throw err;
      else{
        patient.update({
          'PatientID': PatientID,
          'AppointmentRecord.AppointmentID': appointmentID
        }, {
          $set: {
            'AppointmentRecord.$.FeedbackStatus': 'Filled'
          }
        }, function(err) {
          if (err) {
            res.send(err);
          }  else {
            res.send("success");
          }
      }
          );
      }
  });

});

};

let addAllocation = (req, res) => {
  let PhleboID = req.body.PhleboID;
  let Date = req.body.Date;
  let PatientID = req.body.PatientID;
  let Time = req.body.Time;
  let AppointmentID = req.body.AppointmentID;
  let PhleboName = req.body.PhleboName;
  let ProfilePhoto = req.body.ProfilePhoto;
  let Slot = {
    AppointmentID: AppointmentID,
    PatientID: PatientID
  };
  phlebo.find({'PhleboID': PhleboID, 'AllocationStatus.Date': Date}).then((docs) => {
    if (docs.length == 0) {
      phlebo.find({'PhleboID': PhleboID}).then((doc) => {
        if (Time == '09:00-11:00') {
          doc[0].AllocationStatus.push({Date: Date, Slot1: Slot});
        } else if (Time == '11:00-13:00') {
          doc[0].AllocationStatus.push({Date: Date, Slot2: Slot});
        } else if (Time == '14:00-16:00') {
          doc[0].AllocationStatus.push({Date: Date, Slot3: Slot});
        } else if (Time == '16:00-18:00') {
          doc[0].AllocationStatus.push({Date: Date, Slot4: Slot});
        }
        doc[0].save(function(err) {
          if (err)
            throw err;
          }
        );
      }),
      (error2) => {
        res.send(error2);
      }
    } else {
      phlebo.find({'PhleboID': PhleboID}).then((doc) => {
        doc[0].AllocationStatus.map((item) => {
          if (item.Date == Date) {
            if (Time == '09:00-11:00') {
              item.Slot1.AppointmentID = AppointmentID;
              item.Slot1.PatientID = PatientID;
            } else if (Time == '11:00-13:00') {
              item.Slot2.AppointmentID = AppointmentID;
              item.Slot2.PatientID = PatientID;
            } else if (Time == '14:00-16:00') {
              item.Slot3.AppointmentID = AppointmentID;
              item.Slot3.PatientID = PatientID;
            } else if (Time == '16:00-18:00') {
              item.Slot4.AppointmentID = AppointmentID;
              item.Slot4.PatientID = PatientID;
            }
          }
        })
        doc[0].save(function(err) {
          if (err)
            throw err;
          }
        );
      })
    }
  });
  patient.find({'PatientID':PatientID}).then((docs) => {
    docs[0].AppointmentRecord.map((item)=>{
      if(item.AppointmentID == AppointmentID){
        item.Status = 'Assigned';
        item.AssignedPhelbo.CheckOut = '00:00';
        item.AssignedPhelbo.CheckIn = '00:00';
        item.AssignedPhelbo.ID = PhleboID;
        item.AssignedPhelbo.Name = PhleboName;
        item.AssignedPhelbo.ProfilePhoto = ProfilePhoto;
      }
    })
    docs[0].save(function(err) {
      if (err)
        throw err;
        res.send(docs);
      }
    );
  });
};

let cancelPhlebo = (req, res) => {
  let phleboId = req.body.phleboId;
  let appointmentID = req.body.appointmentID;
  let patientID = req.body.patientID;
  let Date1= req.body.date;
  phlebo.find({'PhleboID':phleboId}).then((docs) => {
    docs[0].AllocationStatus.map((item)=>{
      if(item.Date == Date1) {
        if(item.Slot1.AppointmentID == appointmentID && item.Slot1.PatientID ==patientID) {
          item.Slot1.Status = "";
          item.Slot1.Test = "";
          item.Slot1.PatientID = "";
          item.Slot1.AppointmentID = "";
        }
        else if(item.Slot2.AppointmentID == appointmentID && item.Slot2.PatientID == patientID) {
          item.Slot2.Status = "";
          item.Slot2.Test = "";
          item.Slot2.PatientID = "";
          item.Slot2.AppointmentID = "";
        }
        else if(item.Slot3.AppointmentID == appointmentID && item.Slot3.PatientID == patientID) {
          item.Slot3.Status = "";
          item.Slot3.Test = "";
          item.Slot3.PatientID = "";
          item.Slot3.AppointmentID = "";
        }
        else if(item.Slot4.AppointmentID == appointmentID && item.Slot4.PatientID == patientID) {
          item.Slot4.Status = "";
          item.Slot4.Test = "";
          item.Slot4.PatientID = "";
          item.Slot4.AppointmentID = "";
        }
      }
    });
    docs[0].save(function(err) {
      if (err)
        throw err;

        patient.find({'PatientID':patientID}).then((docs1) => {
          docs1[0].AppointmentRecord.map((item) => {
            if(item.AppointmentID == appointmentID) {
              item.AssignedPhelbo.CheckOut = "";
              item.AssignedPhelbo.CheckIn = "";
              item.AssignedPhelbo.ID = "";
              item.AssignedPhelbo.Name = "";
              item.Status = "Unassigned";
            }
          });
          docs1[0].save(function(err) {
            if (err)
              throw err;
              res.send("Appointment successfully deleted");
          });
        });
      });
  });
};

let CheckInStatus = (req, res) => {
  let phleboId = req.body.phleboId;
  let appointmentID = req.body.appointmentID;
  let patientID = req.body.patientID;
  let Date1= req.body.date;
  phlebo.findOneAndUpdate({
    'PhleboID' : phleboId
  }, {
    $set: {
      Location: {
        Latitude: req.body.lat,
        Longitude:req.body.lng
      }
    }
  },function(err) {
    if (err) {
  } else {
  }
  });
  phlebo.find({'PhleboID':phleboId}).then((docs) => {
    docs[0].AllocationStatus.map((item)=>{
      if(item.Date == Date1) {
        if(item.Slot1.AppointmentID == appointmentID && item.Slot1.PatientID ==patientID) {
          item.Slot1.Status = "Checked In";
          item.Slot1.CheckIn = "09:30";
        }
        else if(item.Slot2.AppointmentID == appointmentID && item.Slot2.PatientID == patientID) {
          item.Slot2.Status = "Checked In";
            item.Slot2.CheckIn = "11:30";
        }
        else if(item.Slot3.AppointmentID == appointmentID && item.Slot3.PatientID == patientID) {
          item.Slot3.Status = "Checked In";
        item.Slot2.CheckIn = "14:00";
        }
        else if(item.Slot4.AppointmentID == appointmentID && item.Slot4.PatientID == patientID) {
          item.Slot4.Status = "Checked In";
          item.Slot4.CheckIn = "16:30";
        }
      }
    });
    docs[0].save(function(err) {
      if (err)
        throw err;
        patient.find({'PatientID':patientID}).then((docs1) => {
          docs1[0].AppointmentRecord.map((item) => {
            if(item.AppointmentID == appointmentID) {
              item.Status = "Checked In";
              if(item.PreferredTime == "09:00-11:00")
              {
                item.AssignedPhelbo.CheckIn = "09:30"
              }
              else if(item.PreferredTime == "11:00-13:00")
              {
                item.AssignedPhelbo.CheckIn = "11:30"
              }
              else if(item.PreferredTime == "14:00-16:00")
              {
                item.AssignedPhelbo.CheckIn = "14:00"
              }
              else if(item.PreferredTime == "16:00-18:00")
              {
                item.AssignedPhelbo.CheckIn = "16:00"
              }
            }
          });
          docs1[0].save(function(err) {
            if (err)
              throw err;
              res.send("checked status updated");
          });
        });
      });
  });

};
let CheckOutStatus = (req, res) => {
  let phleboId = req.body.phleboId;
  let appointmentID = req.body.appointmentID;
  let patientID = req.body.patientID;
  let Date1= req.body.date;
  phlebo.findOneAndUpdate({
    'PhleboID' : phleboId
  }, {
    $set: {
      Location: {
        Latitude: 12.853657,
        Longitude:77.662451
      }
    }
  },function(err) {
    if (err) {
  } else {
  }
  });
  phlebo.find({'PhleboID':phleboId}).then((docs) => {
    docs[0].AllocationStatus.map((item)=>{
      if(item.Date == Date1) {
        if(item.Slot1.AppointmentID == appointmentID && item.Slot1.PatientID ==patientID) {
          item.Slot1.Status = "Completed";
          item.Slot1.CheckOut = "10:40";
      }
        else if(item.Slot2.AppointmentID == appointmentID && item.Slot2.PatientID == patientID) {
          item.Slot2.Status = "Completed";
            item.Slot2.CheckOut = "12:30";
        }
        else if(item.Slot3.AppointmentID == appointmentID && item.Slot3.PatientID == patientID) {
          item.Slot3.Status = "Completed";
        item.Slot2.CheckOut = "15:40";

        }
        else if(item.Slot4.AppointmentID == appointmentID && item.Slot4.PatientID == patientID) {
          item.Slot4.Status = "Completed";
          item.Slot4.CheckOut = "17:30";

        }
      }
    });
    docs[0].save(function(err) {
      if (err)
        throw err;
        patient.find({'PatientID':patientID}).then((docs1) => {
          docs1[0].AppointmentRecord.map((item) => {
            if(item.AppointmentID == appointmentID) {

              item.Status = "Completed";
              if(item.PreferredTime == "09:00-11:00")
              {
                item.AssignedPhelbo.CheckOut = "10:40"
              }
              else if(item.PreferredTime == "11:00-13:00")
              {
                item.AssignedPhelbo.CheckOut = "12:30"
              }
              else if(item.PreferredTime == "14:00-16:00")
              {
                item.AssignedPhelbo.CheckOut = "15:40"
              }
              else if(item.PreferredTime == "16:00-18:00")
              {
                item.AssignedPhelbo.CheckOut = "17:30"
              }
            }
          });
          docs1[0].save(function(err) {
            if (err)
              throw err;
              res.send("checked out status updated");
          });
        });
      });
  });

};
let editPhlebo=(req,res)=>{
   var PhleboID = req.body.PhleboID;
   var Password = req.body.Password;
   phlebo.update({
     'PhleboID': PhleboID
   }, {
     $set: {
       'ContactNumber': req.body.ContactNumber,
       'Address': req.body.Address
     }
   }, function(err) {
     if (err) {
     }
   });
   user.update({'Loginid':PhleboID},{'$set':{'Password':req.body.Password}},function(err){
     if (err) {
          res.send(err);
        } else {
          res.json({message: 'User updated successfully'});
        }
      })
 };

module.exports = {
addPhlebo,
viewPhlebo,
viewPhleboAppointments,
addFeedback,
addAllocation,
cancelPhlebo,
CheckInStatus,
CheckOutStatus,
editPhlebo,
viewPhleboWithId
};
