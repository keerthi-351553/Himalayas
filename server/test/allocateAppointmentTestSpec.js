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
  it('coordinator should Allocate an appointment to phlebo', function(done){
    let PhleboID = 'PH1';
    let Date = '30/08/2017'
    let PatientID = 'PA2';
    let Time = '9.00-11.00';
    let AppointmentID = 'AP4';
    let PhleboName = 'Sunil';
    phleboUrl
    .post('/addAllocation')
    .send({PhleboID, Date, PatientID, Time, AppointmentID, PhleboName})
    .expect(200)
    .end(function(er, res){
      if (err) {
        throw done(err);
      }
      else{
        done();
      }
    });
  });
});  
