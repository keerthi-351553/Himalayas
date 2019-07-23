'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();

const phlebotomistCtrl = require('./phlebotomistController')
router.post('/addPhlebo',phlebotomistCtrl.addPhlebo);
router.get('/viewPhlebo',phlebotomistCtrl.viewPhlebo);
router.post('/viewPhleboAppointments',phlebotomistCtrl.viewPhleboAppointments);
router.post('/addFeedback',phlebotomistCtrl.addFeedback);
router.post('/addAllocation',phlebotomistCtrl.addAllocation);
router.post('/cancelPhlebo',phlebotomistCtrl.cancelPhlebo);
router.post('/CheckInStatus',phlebotomistCtrl.CheckInStatus);
router.post('/CheckOutStatus',phlebotomistCtrl.CheckOutStatus);
router.post('/editPhlebo',phlebotomistCtrl.editPhlebo);
router.post('/viewPhleboWithId',phlebotomistCtrl.viewPhleboWithId);

module.exports = router;
