var wd = require('wd'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('uuid-js');

var VARS = {};

// This assumes that selenium is running at http://127.0.0.1:4444/wd/hub/
var noop = function() {},
    b = wd.promiseChainRemote();

    describe('Max app functional testing', function() {

      this.timeout(60000);

      it('Patient must be able to fix his/her appointment', function(done) {

    b.chain(function(err) {
      done(err);
    })
    .init({
      browserName: 'firefox'
    })
    .get("http://localhost:3000/")
    .elementById("//div[@id='app']/div/div/div[2]/div/form/div[1]/div/input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "PA3", noop);
      });
    })
    .elementById("//div[@id='app']/div/div/div[2]/div/form/div[2]/div/input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "maxapp@123", noop);
      });
    })
    .elementById("//div[@id='app']//button[.='Submit']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[@id='app']//button[.=' ']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("date", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "2017-09-06", noop);
      });
    })
    .elementById("//div[@class='center']//label[.='16:00-18:00']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByName("submit", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[5]/div/div/div/div/div/div/div/div", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .close(function(err) {
      done(err);
    });

  });
});

afterEach(function() {
  b.quit();
});
