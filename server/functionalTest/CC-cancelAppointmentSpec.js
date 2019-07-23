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

  it('Customer care must be able to cancel an appointment', function(done) {

    b.chain(function(err) {
      done(err);
    })
    .init({
      browserName: 'firefox'
    })
    .get("http://localhost:3000/")
    .elementById("ui input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "callcenter", noop);
      });
    })
    .elementById("ui input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "callcentr", noop);
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
        expect("" + text).to.contain("" + "Max Health Care Welcome callcenter(Customer care)");
      });
    })
    .elementById("ui orange icon", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Cancel appointment");
      });
    })
    .elementById("ui red button", function(err, el) {
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
