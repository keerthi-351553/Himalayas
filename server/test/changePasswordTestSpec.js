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

  it("Patient must be able to change his password", function(done){
    let userMock = sinon.mock(user({Password:'Believe'}));
    let users = userMock.object;
    let expectedResult = { status: true };
    userMock.expects('update').yields(null, expectedResult);
    users.update({Username:'PA5'},function (err, result) {
      userMock.verify();
      userMock.restore();
      console.log(result);
      expect(result.status).to.be.true;
      done();
    });
  });
});
