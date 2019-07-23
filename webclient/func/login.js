import React from 'react';
import { shallow } from 'enzyme';
import Login from '../components/mainComponents/login.jsx';
console.log('inside test file');
describe('Login', () => {
  let login  = shallow(<Login />);
    it('renders title', () => {
      expect(login.find('h1').text()).toEqual('Max health care');
    });
  });

// var webdriver = require('selenium-webdriver'),
//     By = webdriver.By,
//     until = webdriver.until;
// // var _ = require('underscore');
// var VARS = {};
//
// var globalTimeout = 60*1000;
//
// var driver = new webdriver.Builder()
//     .forBrowser('chrome')
//     .build();
//
// driver.controlFlow().on('uncaughtException', function(err) {
//     console.log('There was an uncaught exception: ' + err);
// });
// driver.get("http://localhost:3000/");
// console.log("successfully opened url");
// driver.findElement(By.xpath("//div[@id='app']/div/div/form/div[1]/div/input")).clear();
// driver.findElement(By.xpath("//div[@id='app']/div/div/form/div[1]/div/input")).sendKeys("demo");
// driver.findElement(By.xpath("//div[@id='app']/div/div/form/div[2]/div/input")).clear();
// driver.findElement(By.xpath("//div[@id='app']/div/div/form/div[2]/div/input")).sendKeys("demo@123");
// // driver.findElement(By.xpath("//div[@id='app']//button[.='Submit']")).click();
// driver.getTitle().then(function (title) {
//     console.log("title is: " + title);
// });
// driver.quit();
