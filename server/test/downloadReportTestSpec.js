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
  it('Patient should be able to download his report',(done)=>{
    var patientMock = sinon.mock(patients);
    var expectedResult = {status:true};
    var a = '5996e6ffe1978f1d6003a390';
    patients.find({PatientID:"PA1"}, function(err,doc){
      patientMock.verify();
      patientMock.restore();
      expect(doc[0].AppointmentRecord[0].Report).to.be.String;
      done();
    });
  });
  });
