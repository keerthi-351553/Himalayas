const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const patients = require('../patients/patientEntity').patient;
const patienturl = supertest('http://localhost:4200/patients');
const phlebos = require('../phlebotomist/phlebotomistEntity').phlebo;
const phlebourl = supertest('http://localhost:4200/phlebos');


describe('User CRUD Testing using sinon',()=>{
  it('should get list appointment as Coordinator', function(done){
      patienturl
      .get('/viewPatients')
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should get list appointment as CallCenter', function(done){
      patienturl
      .get('/viewPatients')
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should get list Appointment as Patient', function(done){
      let PatientID = 'PA7';
      patienturl
      .post('/viewAppointment')
      .send({PatientID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should get list Appointment with phlebo ID', function(done){
      let PhleboID = 'PH1';
      phlebourl
      .post('/viewPhleboAppointments')
      .send({PhleboID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should get list Appointment with patient ID', function(done){
      let PatientID = 'PA7';
      patienturl
      .post('/viewPatientWithId')
      .send({PatientID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });


});
