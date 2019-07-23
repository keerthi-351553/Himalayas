import ReactDOM from 'react-dom';
import React, {Component} from 'react'
const {hashHistory} = require('react-router');
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import ReactTable from 'react-table';
import {Icon, Button, Card, Dimmer, Header, Form, Radio, Table,  Dropdown} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class childComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      date:"",
      text1:"Schedule",
      text2:"Assign To MySelf",
      PatientIDs:[],
      patientID:'',
      uid:'',
      count:0,
      aId:'',
      patientDetail:{},
      date1:'',
      allphlebodetails:{},
      temp:0,
      temp1:0
    }
    this.changeUserEnterPwd = this.changeUserEnterPwd.bind(this);
  }
  componentWillMount(){
    let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd,
      mm;
    dd = (('' + (d.getDate()) ).length == 2)
      ? (d.getDate())
      : '0' + (d.getDate());
    mm = (('' + d.getMonth()).length == 2)
      ? (d.getMonth() + 1)
      : '0' + (d.getMonth() + 1);
    let date = d.getFullYear() + '-' + mm + '-' + dd;
    this.setState({date:date,date1:date});
    this.getallpatients();
  }
  checkForDateAlert1(){
    this.refs.asd.warning(' already User have appointment for this slot', '', {
      timeOut: 1000,
      extendedTimeOut: 1000
    });
  }
  checkForDateAlert2(){
    this.refs.asd.warning(' you are not available for this slot', '', {
      timeOut: 1000,
      extendedTimeOut: 1000
    });
  }
  checkForDateAlert(){
    this.refs.asd.warning('Enter future date', '', {
      timeOut: 1000,
      extendedTimeOut: 1000
    });
  }
  loadData() {
  var pid = this.state.patientID
  var arr = [];
  var count = 0;
  var temp = [];
  var i = 0;
let context = this;
  $.ajax({
    url: "/patients/viewAppointment",
    type: 'POST',
    async: false,
    data: {
      pid: pid
    },
    success: function(data) {
      context.setState({patientDetail:data[0]},function(){
      });
      let length = data[0].PatientID.length;
        let uid = data[0].PatientID.substring(2);
        this.setState({uid:uid});
        if (data[0].AppointmentRecord.length != 0) {
          data[0].AppointmentRecord.map(function(item, key) {
            var num = Number(item.AppointmentID.substring(length));
            temp[i++] = num;
            var b = temp
            count++;
            arr.push({AppointmentID: item.AppointmentID, PreferredDate: item.PreferredDate, Status: item.Status})
          });
          var length1 = temp.length;
          temp.sort(this.sortNumber);
          count = temp[length1 - 1];
          this.setState({
            count: count
          }, function() {});
        } else {
          let num1 = 0;
          this.setState({count: num1});
        }
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
  });
}
  getallpatients(){
    let context = this;
    $.ajax({
        url:"/patients/viewPatients",
        type:'GET',
        success: function(data)
        {
          data.map((item)=>{
            let arr1 = this.state.PatientIDs;
            let obj={ key: item.PatientID, value: item.PatientID, text: item.PatientID };
            arr1.push(obj);
            context.setState({PatientIDs:arr1},function(){
            });
          });
        }.bind(this),
        error: function(err)
        {
          console.log('error occurred on AJAX');
        }.bind(this)
      });
  }
  handleChange = (e, { value }) => this.setState({ value });
  sortNumber(a, b) {
    return a - b;
  }
    scheduleAppointment() {
      var test = 0;
         var count1 =0;
         var context = this;
         console.log('new Date(this.state.date)',this.state.date);
         console.log('new Date()',new Date());
         if(new Date(this.state.date) > new Date()){
           var d = this.state.date;
           let a = d.split('-');
           a.reverse();
           var date = a.join('/');
           this.state.patientDetail.AppointmentRecord.map(function(item, key) {
             if(date == item.PreferredDate){
               if(context.state.value == item.PreferredTime && item.Status != 'Canceled'){
                 test = test +1;
               }else{
                   count1 = 0;
               }
             }else{
                   count1 =0;
             }
           });
 if(test == 0 && count1 == 0){
    var pid = this.state.patientID;
    var count = this.state.count;
    count = count + 1;
    var uid = this.state.uid;
    var aid = "AP" + uid +count;
    this.setState({aId:aid});
    let date = this.state.date;
    let a = date.split('-');
    a.reverse();
    date = a.join('/');
    var time = this.state.value;
    $.ajax({
      url: "/patients/scheduleAppointment",
      type: 'POST',
      data: {
        pid: pid,
        date: date,
        time: time,
        aid: aid
      },
      success: function(data) {
        this.setState({text1: "Scheduled"})
        this.refs.asd.success(' Appointment submitted', '', {
          timeOut: 1000,
          extendedTimeOut: 1000
        });
        this.props.newRequeststatus(true);
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }else{
      this.checkForDateAlert1();
  }
 }
  else{
    this.checkForDateAlert();
  }
  }
  getPhleboDetails(){
var temp =0;
var temp1 =0;
    let context = this;
    $.ajax({
      url: "/phlebotomist/viewPhlebo",
      type: 'GET',
      success: function(data) {
        data.map((item)=>{
          if(item.PhleboID == cookies.get('loginid')){
              context.setState({allphlebodetails:item},function(){
                this.state.allphlebodetails.AllocationStatus.map((item)=>{
                          if(item.Date == this.state.date){
                                  if((item.Slot1.Time == this.state.value || item.Slot2.Time == this.state.value || item.Slot3.Time == this.state.value || item.Slot4.Time == this.state.value)
                                    && (item.Slot1.Status != 'Cancelled' || item.Slot2.Status != 'Cancelled' ||  item.Slot3.Status != 'Cancelled' || item.Slot4.Status != 'Cancelled')){
                                    alert('error');
                                    temp =temp+1
                                  }else{
                                    temp1 =0;
                                        }
                            }
                                  else{
                                temp1 =0;
                                  }

                          });

                });
context.setState({temp:temp,temp1:temp1});
              }
});


      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }
  scheduleAppointmentToMyself(){

    var test = 0;
       var count1 =0;
       var context = this;
       if(new Date(this.state.date) > new Date()){
         var d = this.state.date;
         let a = d.split('-');
         a.reverse();
         var date = a.join('/');
         this.state.patientDetail.AppointmentRecord.map(function(item, key) {
           if(date == item.PreferredDate){
             if(context.state.value == item.PreferredTime && item.Status != 'Canceled'){
               test = test +1;
             }else{
                 count1 = 0;
             }
           }else{
                 count1 =0;
           }
         });
    if(test == 0 && count1 == 0){
  this.getPhleboDetails();


if(this.state.temp == 0 && this.state.temp1 == 0)
  {
    var pid = this.state.patientID;
    var count = this.state.count;
    count = count + 1;
    var uid = this.state.uid;
    var aid = "AP" + uid +count;
    this.setState({aId:aid});
    let date = this.state.date;
    let a = date.split('-');
    a.reverse();
    date = a.join('/');
    var time = this.state.value;
    $.ajax({
      url: "/patients/scheduleAppointment",
      type: 'POST',
      data: {
        pid: pid,
        date: date,
        time: time,
        aid: aid
      },
      success: function(data) {
        this.setState({text1: "Scheduled"})
        this.refs.asd.success(' Submitted successfully', '', {
          timeOut: 1000,
          extendedTimeOut: 1000
        });
        let data1 = {
          PhleboID:cookies.get('loginid'),
          Date:this.state.date,
          PatientID:this.state.patientID,
          Time:this.state.value,
          AppointmentID:this.state.aId,
          PhleboName:cookies.get('username'),
          ProfilePhoto:this.props.ProfilePhoto
        };
        let context = this;
        $.ajax({
          url: '/phlebotomist/addAllocation',
          type: 'POST',
          data: data1,
          success: function(result) {
            // context.checkForAllocateAlert();
            // location.reload();
            this.props.newRequeststatus(false);
          }.bind(this),
          error: function(err) {
            console.log('error occurred on AJAX');
          }.bind(this)
        });
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }else{
      this.checkForDateAlert2();
  }


  }
  else{
    this.checkForDateAlert1();
  }
    // this.scheduleAppointment();
  }

  else{
    this.checkForDateAlert();
  }
}

  changeUserEnterPwd(e){
    let date = e.target.value;
      this.setState({date: date, date1:date});
  }
  changePatientID(e){
    let patientID = e.target.value;
    this.setState({patientID});
  }
  patientIDselect(e,a){
    // this.setState({patientID:a.value});
    this.setState({patientID:a.value},function(){
      this.loadData();
    });

  }
  render() {
    let today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    if(dd<10) {
      dd = '0'+dd
    }
    if(mm<10) {
      mm = '0'+mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    return (
      <div>
          <Card style={{color:'black',margin:'0 auto',boxShadow:"none"}}>
            <h3>Create new appointment</h3>
                 <label className="control-label" for="date" style={{textAlign:'left',marginTop:'3%',marginLeft:'3%'}}>Appointment date</label>
                 <input className="form-control" id="date" min={today} name="date" type="date" style={{marginLeft:'15%',width:'80%',borderColor:'orange'}} onChange={this.changeUserEnterPwd} value={this.state.date1}/>
                 <Dropdown placeholder='Select the patient ID' selection options={this.state.PatientIDs} onChange={this.patientIDselect.bind(this)} style={{textAlign:'left',marginTop:'3%',marginLeft:'15%', width:"80%", borderColor:'orange'}}/>

               <Form style={{marginTop:'3%'}}>
                    <Form.Field style={{textAlign:'-webkit-left',marginLeft:'3%'}}>
                    <b style={{textAlign:'left'}}>Appointment time</b>
                    </Form.Field>
                    <Form.Field style={{textAlign:'-webkit-left',marginLeft:'15%'}}>
                      <Radio label='09:00-11:00' name='radioGroup' style={{borderColor:'orange'}} value='09:00-11:00' checked={this.state.value === '09:00-11:00'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field style={{textAlign:'-webkit-left',marginLeft:'15%'}}>
                      <Radio label='11:00-13:00' name='radioGroup' value='11:00-13:00' checked={this.state.value === '11:00-13:00'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field style={{textAlign:'-webkit-left',marginLeft:'15%'}}>
                      <Radio label='14:00-16:00' name='radioGroup' value='14:00-16:00' checked={this.state.value === '14:00-16:00'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field style={{textAlign:'-webkit-left',marginLeft:'15%'}}>
                      <Radio label='16:00-18:00' name='radioGroup' value='16:00-18:00' checked={this.state.value === '16:00-18:00'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </Form>
               <div className="form-group">
                 <Button inverted color='orange' name="submit" type="submit" onClick={this.scheduleAppointment.bind(this)}>{this.state.text1}</Button>
                 <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
                   marginTop: '8%'
                 }}/>
                 <Button inverted color='orange' name="submit" type="submit" onClick={this.scheduleAppointmentToMyself.bind(this)}>{this.state.text2}</Button>
                 <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
                   marginTop: '8%'
                 }}/>
                 </div>
          </Card>
             </div>
    );
  }
}

module.exports = childComponent;
