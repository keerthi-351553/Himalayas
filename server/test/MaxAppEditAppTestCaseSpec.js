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

  it('should Reshedule an appointment as Callcenter', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1';
      let date = '04/09/2017';
      let time = '14:00-16:00';
      patienturl
      .post('/reScheduleAppointment')
      .send({PhleboID, PatientID, AppointmentID, date, time})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should Reshedule an appointment as Coordinator', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1';
      let date = '04/09/2017';
      let time = '14:00-16:00';
      patienturl
      .post('/reScheduleAppointment')
      .send({PhleboID, PatientID, AppointmentID, date, time})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  it('should Reshedule an appointment as Patient', function(done){
      let PatientID = 'PA6';
      let AppointmentID = 'AP7';
      let PhleboID = 'PH1';
      let date = '04/09/2017';
      let time = '14:00-16:00';
      patienturl
      .post('/reScheduleAppointment')
      .send({PhleboID, PatientID, AppointmentID, date, time})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
});
