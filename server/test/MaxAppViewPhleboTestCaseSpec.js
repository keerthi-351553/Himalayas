const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const phlebos = require('../phlebotomist/phlebotomistEntity').phlebo;
const phlebourl = supertest('http://localhost:4200/phlebos');

describe('User CRUD Testing using sinon',()=>{
  it('should view Phlebotomist Details as Coordinator', function(done){
      phlebourl
      .get('/viewPhlebo')
      .expect(200)
      .end(function(er, res){
          done();
      });
    });
});
