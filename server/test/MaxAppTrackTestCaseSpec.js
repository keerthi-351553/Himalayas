const should = require('chai').should();
const supertest = require('supertest');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const expect = require('chai').expect;
const app = require('../../bin/www');
const phlebos = require('../phlebotomist/phlebotomistEntity').phlebo;
const phlebourl = supertest('http://localhost:4200/phlebos');

describe('User CRUD Testing using sinon',()=>{

  it('should get a Phlebo Location as Coordinator',(done)=>{
              var phleboMock = sinon.mock(phlebos);
              var expectedResult = {status:true};
              var a = '5996e6ffe1978f1d6003a390';
              phlebos.find({PhleboID:"PH1"}, function(err,doc){
                phleboMock.verify();
                  phleboMock.restore();
                  expect(doc[0].Location.Latitude).to.be.String;
                  expect(doc[0].Location.Longitude).to.be.String;
              done();
            });
        });
        it('should get a Phlebo Location as Callcenter',(done)=>{
                    var phleboMock = sinon.mock(phlebos);
                    var expectedResult = {status:true};
                    var a = '5996e6ffe1978f1d6003a390';
                    phlebos.find({PhleboID:"PH1"}, function(err,doc){
                      phleboMock.verify();
                        phleboMock.restore();
                        expect(doc[0].Location.Latitude).to.be.String;
                        expect(doc[0].Location.Longitude).to.be.String;
                    done();
                  });
              });
              it('should get a Phlebo Location as Patient',(done)=>{
                          var phleboMock = sinon.mock(phlebos);
                          var expectedResult = {status:true};
                          phlebos.find({PhleboID:"PH1"}, function(err,doc){
                            phleboMock.verify();
                              phleboMock.restore();
                              expect(doc[0].Location.Latitude).to.be.String;
                              expect(doc[0].Location.Longitude).to.be.String;
                          done();
                        });
                    });
                    it('should get a Phlebo Location as Phlebotomist',(done)=>{
                                var phleboMock = sinon.mock(phlebos);
                                var expectedResult = {status:true};
                                var a = '5996e6ffe1978f1d6003a390';
                                phlebos.find({PhleboID:"PH1"}, function(err,doc){
                                  phleboMock.verify();
                                    phleboMock.restore();
                                    expect(doc[0].Location.Latitude).to.be.String;
                                    expect(doc[0].Location.Longitude).to.be.String;
                                done();
                              });
                          });
});
