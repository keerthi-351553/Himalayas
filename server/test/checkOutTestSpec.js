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
  it('Phlebo should be able to Checkout', function(done){
    let phleboId = 'PH1';
    let appointmentID = 'AP4';
    let patientID = 'PA3';
    let Date1 = '25/08/2017';
    phleboUrl
    .post('/CheckOutStatus')
    .send({phleboId, appointmentID, patientID, Date1})
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
