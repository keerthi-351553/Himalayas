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

      it('Patient must be able to reschedule his/her appointment', function(done) {

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
    .elementById("//div[@class='rt-tbody']//div[.='25/08/2017']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByCssSelector("i.edit.icon", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[6]/div/div/div/div/form/div[5]/div/label", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByName("submit", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Please select a future date");
      });
    })
    .elementByCssSelector("input.form-control", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "2017-09-05", noop);
      });
    })
    .elementByName("submit", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[6]/div/div/div/div/div/div/div", function(err, el) {
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
