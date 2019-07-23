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

  it('Customer care must be able to register a patient', function(done) {

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
        b.next('type', el, "callcenter", noop);
      });
    })
    .elementById("ui orange button", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Register");
      });
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Add a new patient");
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "Ramesh", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "Iyer", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "22", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "male", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "12/12/1994", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "9874546214", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "ramesh@gmail.com", noop);
      });
    })
    .elementById("field", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "abcxnxnhujh fvljnfe", noop);
      });
    })
    .elementById("ui orange button", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Register");
      });
    })
    .elementByCssSelector("div.toast-message", function(err, el) {
      b.next('clickElement', el, noop);
    })
      .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Enter proper address");
      });
    })
    .elementById("button", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "Krishnarajpuram,banglore", noop);
      });
    })
    .elementById("ui button", function(err, el) {
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
