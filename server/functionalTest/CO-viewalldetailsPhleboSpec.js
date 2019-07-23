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

      it('Coordinator care must be able to view all details of a phlebo', function(done) {


    b.chain(function(err) {
      done(err);
    })
    .init({
      browserName: 'firefox'
    })
    .get("http://localhost:3000/")
    .elementById("//div[@id='app']/div/div/div[2]/div/form/div[1]/div/input", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByCssSelector("body", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("//div[@id='app']/div/div/div[2]/div/form/div[1]/div/input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "coordinator", noop);
      });
    })
    .elementById("//div[@id='app']/div/div/div[2]/div/form/div[2]/div/input", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "coordinator", noop);
      });
    })
    .elementById("//div[@id='app']//button[.='Submit']", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByLinkText("My Staff", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByCssSelector("div.header", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Phlebotomist ID PH1");
      });
    })
    .elementByTagName('html', function(err, el) {
      b.next('text', el, function(err, text) {
        expect("" + text).to.contain("" + "Phlebotomist ID PH1Phlebotomist detailsNameSunil Kumar1Age301DOB09/02/19841GenderMale1Addressasdf1C");
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
