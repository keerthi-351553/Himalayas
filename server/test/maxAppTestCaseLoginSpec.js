const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const users = require('../users/userEntity').user;
const url = supertest('http://localhost:4200/users');

describe('User CRUD Testing using sinon',()=>{
  it('should Login as Patient',(done)=>{
        var userMock = sinon.mock(users);
        var expectedResult = {status:true};
        var a = '5996e6ffe1978f1d6003a390';
        users.find({Username:"PA1"}, function(err,doc){
          userMock.verify();
            userMock.restore();
            // expect(doc.status).to.be.true;
            doc[0].Role.should.equal('PA');
        done();
      });
  });
  it('should Login as Phlebotomist',(done)=>{
        var userMock = sinon.mock(users);
        var expectedResult = {status:true};
        var a = '5996e6ffe1978f1d6003a390';
        users.find({Username:"TonyStark"}, function(err,doc){
          userMock.verify();
            userMock.restore();
            // expect(doc.status).to.be.true;
            doc[0].Role.should.equal('PH');
        done();
      });
  });
  it('should Login as Customercare',(done)=>{
        var userMock = sinon.mock(users);
        var expectedResult = {status:true};
        var a = '5996e6ffe1978f1d6003a390';
        users.find({Username:"callcenter"}, function(err,doc){
          userMock.verify();
            userMock.restore();
            // expect(doc.status).to.be.true;
            doc[0].Role.should.equal('CC');
        done();
      });
  });
  it('should Login as Coordinator',(done)=>{
        var userMock = sinon.mock(users);
        var expectedResult = {status:true};
        //var a = '5996e6ffe1978f1d6003a390';
        users.find({Username:"coordinator"}, function(err,doc){
          userMock.verify();
            userMock.restore();
            // expect(doc.status).to.be.true;
            doc[0].Role.should.equal('CO');
        done();
      });
  });
});
