const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const patients = require('../patients/patientEntity').patient;
const patienturl = supertest('http://localhost:4200/patients');

describe('User CRUD Testing using sinon',()=>{
  it('should add Patient as CallCenter', (done) => {
          var patientMock = sinon.mock(new patients({AppointmentRecord:[],ProfilePhoto:"",ContactNumber:"9988776655",Address:"vivekanandhar street, Dubai Cross Road, Near Dubai Bus stand, Dubai",Gender:"Male",DateOfBirth:"10/10/1994",Age:23,LastName:"Priya", FirstName:"Keerthana", PatientID:"PA1000"}));
          var patientObj = patientMock.object;
          var expectedResult = {
              status: true
          };
          patientMock.expects('save').yields(null, expectedResult);
          patientObj.save(function(err, result) {
              patientMock.verify();
              patientMock.restore();
              expect(result.status).to.be.true;
              done();
          });
      });
});
