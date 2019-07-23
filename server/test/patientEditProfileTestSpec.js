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
  it('Patient should be able to edit his profile', function(done){
    let PatientID = 'PA5';
    let FirstName = 'Harley';
    let LastName = 'Quin';
    let ContactNumber = '99563210';
    let DateOfBirth = '22/04/1990';
    let Gender = 'Female';
    let Address = 'Heath forever lane,US';
    patientUrl
    .post('/editProfile')
    .send({PatientID, FirstName, LastName, ContactNumber, DateOfBirth, Gender, Address})
    .expect(200)
    done();
    });
  });
