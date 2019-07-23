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

    it('should Cancel an appointment as Callcenter', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1'
      patienturl
      .post('/cancelAppointment')
      .send({PhleboID, PatientID, AppointmentID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should Cancel an appointment as Patient', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1'
      patienturl
      .post('/cancelAppointment')
      .send({PhleboID, PatientID, AppointmentID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should Cancel an appointment as Phlebotomist', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1';
      let Date = '04/09/2017';
      phlebourl
      .post('/cancelPhlebo')
      .send({PhleboID, PatientID, AppointmentID, Date})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should Cancel an appointment as Coordinator', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1'
      patienturl
      .post('/cancelAppointment')
      .send({PhleboID, PatientID, AppointmentID})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });


});
