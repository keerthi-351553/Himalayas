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

      it('Patient must be able to change his/her password', function(done) {

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
        b.next('type', el, "max@123", noop);
      });
    })
    .elementById("//div[@id='app']//button[.='Submit']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("imgSize", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[@id='app']//button[.='Change password']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("pwd", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "max@123", noop);
      });
    })
    .elementById("pwd2", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "maxapp@123", noop);
      });
    })
    .elementById("pwd3", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "maxapp@123", noop);
      });
    })
    .elementByCssSelector("button.btn.btn-warning", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "password changed successfully");
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
