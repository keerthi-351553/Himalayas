const mongoose = require('mongoose');
let schema = new mongoose.Schema({
  PhleboID: {
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
  LastName: {
    type: String,
    required: true,
    default: ''
  },
  Age: {
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
    default: '/image/user.png'
  },
  Location: {
    Latitude: {
      type: String,
      default: '12.853657'
    },
    Longitude: {
      type: String,
      default: '77.662451'
    }
  },
  AllocationStatus: [
    {
      Date: {
        type: String,
        default: ''
      },
      Slot1: {
        Feedback:{
          Question1:{
            type:String,
            default:''
          },
          Question2:{
            type:String,
            default:''
          },
          Question3:{
            type:String,
            default:''
          },
          Question4:{
            type:String,
            default:''
          },
          Question5:{
            type:String,
            default:''
          },
          Rating:{
            type:String,
            default:''
          }
        },
        Time: {
          type: String,
          default: '09:00-11:00'
        },
        AppointmentID: {
          type: String,
          default: ''
        },
        PatientID: {
          type: String,
          default: ''
        },
        Test: {
          type: String,
          default: 'Blood'
        },
        Status: {
          type: String,
          default: ''
        },
        CheckIn: {
          type: String,
          default: ''
        },
        CheckOut: {
          type: String,
          default: ''
        }
      },
      Slot2: {
        Feedback:{
          Question1:{
            type:String,
            default:''
          },
          Question2:{
            type:String,
            default:''
          },
          Question3:{
            type:String,
            default:''
          },
          Question4:{
            type:String,
            default:''
          },
          Question5:{
            type:String,
            default:''
          },
          Rating:{
            type:String,
            default:''
          }
        },
        Time: {
          type: String,
          default: '11:00-13:00'
        },
        AppointmentID: {
          type: String,
          default: ''
        },
        PatientID: {
          type: String,
          default: ''
        },
        Test: {
          type: String,
          default: 'Blood'
        },
        Status: {
          type: String,
          default: ''
        },
        CheckIn: {
          type: String,
          default: ''
        },
        CheckOut: {
          type: String,
          default: ''
        }
      },
      Slot3: {
        Feedback:{
          Question1:{
            type:String,
            default:''
          },
          Question2:{
            type:String,
            default:''
          },
          Question3:{
            type:String,
            default:''
          },
          Question4:{
            type:String,
            default:''
          },
          Question5:{
            type:String,
            default:''
          },
          Rating:{
            type:String,
            default:''
          }
        },
        Time: {
          type: String,
          default: '14:00-16:00'
        },
        AppointmentID: {
          type: String,

          default: ''
        },
        PatientID: {
          type: String,
          default: ''
        },
        Test: {
          type: String,
          default: 'Blood'
        },
        Status: {
          type: String,
          default: ''
        },
        CheckIn: {
          type: String,
          default: ''
        },
        CheckOut: {
          type: String,
          default: ''
        }
      },
      Slot4: {
        Feedback:{
          Question1:{
            type:String,
            default:''
          },
          Question2:{
            type:String,
            default:''
          },
          Question3:{
            type:String,
            default:''
          },
          Question4:{
            type:String,
            default:''
          },
          Question5:{
            type:String,
            default:''
          },
          Rating:{
            type:String,
            default:''
          }
        },
        Time: {
          type: String,
          default: '16:00-18:00'
        },
        AppointmentID: {
          type: String,
          default: ''
        },
        PatientID: {
          type: String,
          default: ''
        },
        Test: {
          type: String,
          default: 'Blood'
        },
        Status: {
          type: String,
          default: ''
        },
        CheckIn: {
          type: String,
          default: ''
        },
        CheckOut: {
          type: String,
          default: ''
        }
      }
    }
  ]
});

let phlebo = mongoose.model('phlebo', schema);

module.exports = {
  phlebo: phlebo
}
