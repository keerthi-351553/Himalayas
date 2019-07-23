const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  PatientID : {
    type: String,
    required: true,
    unique: true,
    default: ''
  },
  FirstName: {
    type: String,
    required: true,
    default: ''
  },
  LastName : {
    type: String,
    required: true,
    default: ''
  },
  Age :  {
    type: Number,
    required: true,
    default: 0
  },
  DateOfBirth: {
    type: String,
    required: true,
    default: ''
  },
  Gender: {
    type: String,
    required: true,
    default: ''
  },
  Address: {
    type: String,
    required: true,
    default: ''
  },
  ContactNumber: {
    type: String,
    required: true,
    default: 0
  },
  ProfilePhoto: {
    type: String,
    default: '../../image/default.jpg'
  },
  Message: {
    type: String,
    default: 'No updates'
  },
  AppointmentRecord: [
    {
      AppointmentID: {
        type: String,
        default: ''
      },
      PreferredTime: {
        type: String,
        default: ''
      },
      PreferredDate: {
        type: String,
        default: ''
      },
      Test: {
        type: String,
        default: 'Blood'
      },
      Status: {
        type: String,
        default: 'Unassigned'
      },
      Report: {
        type: String,
        default: ''
      },
      FeedbackStatus:{
        type:String,
        default:'Notfilled'
      },
      AssignedPhelbo: {
        Name: {
          type: String,
          default: ''
        },
        ID: {
          type:String,
          default:''
        },
        CheckIn:{
          type:String,
          default:''
        },
        CheckOut:{
          type:String,
          default:''
        },
        ProfilePhoto:{
          type:String,
          default:''
        }
      }
    }
  ]
});

let patient = mongoose.model('patients', schema);

module.exports = {
  patient :patient
}
