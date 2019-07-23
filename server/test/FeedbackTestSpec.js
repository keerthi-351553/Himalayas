const should = require('chai').should();
const supertest = require('supertest');
const ObjId = require('mongodb').ObjectID;
const app = require('../../bin/www');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const phlebo = require('../phlebotomist/phlebotomistEntity').phlebo;
const patients = require('../patients/patientEntity').patient;
const user = require('../users/userEntity').user;
const phleboUrl = supertest('http://localhost:4200/phlebotomist');
const patientUrl = supertest('http://localhost:4200/patients');

describe('Testing Maxapp', function(err){
  it(' Patient should Be able to provide feedback', function(done){
    let PhleboID = 'PH1';
    let PatientID = 'PA3';
    let date = '25/08/2017';
    let appointmentID = 'AP35'
    let question1 = 'Yes';
    let question2 = 'No';
    let question3 = 'Yes';
    let question4 = 'Yes';
    let question5 = 'No';
    let rating = '3';
    phleboUrl
    .post('/addFeedback')
    .send({PhleboID, date, PatientID, appointmentID, question1, question2, question3, question4, question5, rating})
    .expect(200)
    .end(function(er, res){
      if (err) {
        throw done(err);
        done();
      }
      else{
        done();
      }
    });
  });
});
