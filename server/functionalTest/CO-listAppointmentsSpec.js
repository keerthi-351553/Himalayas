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

var noop = function() {},
b = wd.promiseChainRemote();

describe('Max app functional testing', function() {

  this.timeout(60000);

  it('Coordinator care must be able to view list of appointments', function(done) {

    b.chain(function(err) {
      done(err);
    })
    .init({
      browserName: 'firefox'
    })
    .get("http://localhost:3000/")
    .elementById("ui input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "coordinator", noop);
      });
    })
    .elementById("ui input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "coordinator", noop);
      });
    })
    .elementById("ui orange button", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByCssSelector("span", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Max Health Care Welcome Raj(coordinator)");
      });
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "IDPatient NameService DateService TimeAssigned StaffTestAP31Zara L25/08/201711:00-13:00Sunil KumarBloodAP32Zara L28/08/201711:00-13:00--BloodAP33Zara L31/08/201709:00-11:00--BloodAP34Zara L31/09/201711:00-13:00--BloodAP41Raaj");
      });
    })
    .close(function(err) {
      done(err);
    });

  });
});

afterEach(function() {
  b.quit();
});
