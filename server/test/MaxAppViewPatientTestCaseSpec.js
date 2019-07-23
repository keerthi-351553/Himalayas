const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const patients = require('../patients/patientEntity').patient;
const patienturl = supertest('http://localhost:4200/patients');

describe('User CRUD Testing using sinon',()=>{
  it('should view patient Details as CallCenter', function(done){
      patienturl
      .get('/viewPatients')
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
});
