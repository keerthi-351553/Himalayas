const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const phlebos = require('../phlebotomist/phlebotomistEntity').phlebo;
const phlebourl = supertest('http://localhost:4200/phlebos');

describe('User CRUD Testing using sinon',()=>{
  it('should DeAllocate Phlebotomist for a particular appointment as Coordinator', function(done){
    let phleboId = 'PH1';
    let appointmentID = 'AP7';
    let patientID = 'PA6';
    let Date1= '04/09/2017';
        phlebourl
        .post('/cancelPhlebo')
        .send({patientID, appointmentID, phleboId, Date1})
        .expect(200)
        .end(function(er, res){
            done();
        });
      });
    it('should DeAllocate Phlebotomist for a particular appointment as Phlebotomist', function(done){
      let phleboId = 'PH1';
      let appointmentID = 'AP7';
      let patientID = 'PA6';
      let Date1= '04/09/2017';
          phlebourl
          .post('/cancelPhlebo')
          .send({patientID, appointmentID, phleboId, Date1})
          .expect(200)
          .end(function(er, res){
              done();
          });
        });
});
