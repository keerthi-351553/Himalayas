const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
//const app = require('../bin/www');
const patients = require('../patients/patientEntity').patient;
//const patients = require('../server/patients/patientEntity').patient;
const patienturl = supertest('http://localhost:4200/patients');

describe('User CRUD Testing using sinon',()=>{
  it('should fix appointment as Callcenter', function(done){
      let PatientID = 'PA7';
      let AppointmentID = 'AP12';
      let PreferredTime =  '09:00-11-00';
      let PreferredDate = '10/09/2017';
      patienturl
      .post('/addAppointment')
      .send({PatientID, AppointmentID, PreferredTime, PreferredDate})
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
  // it('should fix appointment as Patient', function(done){
  //     let PatientID = 'PA7';
  //     let AppointmentID = 'AP12';
  //     let date =  '10/09/2017';
  //     let time = '09:00-11-00';
  //     patienturl
  //     .post('/scheduleAppointment')
  //     .send({PatientID, AppointmentID, date, time})
  //     .expect(200)
  //     .end(function(er, res){
  //         done();
  //     });
  //   });
  // it('should fix appointment as Phlebotomist', function(done){
  //     let PatientID = 'PA7';
  //     let AppointmentID = 'AP12';
  //     let date =  '10/09/2017';
  //     let time = '09:00-11-00';
  //     patienturl
  //     .post('/scheduleAppointment')
  //     .send({PatientID, AppointmentID, date, time})
  //     .expect(200)
  //     .end(function(er, res){
  //         done();
  //     });
  //   });
});
