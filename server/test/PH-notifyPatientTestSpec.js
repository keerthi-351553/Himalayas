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
  it('Phlebo must be able to send messages to patient', function(done){
    let pid = 'PA5';
    patientUrl
    .post('/sendMessage')
    .send({pid})
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
