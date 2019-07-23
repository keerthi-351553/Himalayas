import ReactDOM from 'react-dom';
import React, {Component} from 'react'
const {hashHistory} = require('react-router');
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import ReactTable from 'react-table';
import {
  Icon,
  Button,
  Card,
  Dimmer,
  Header,
  Form,
  Radio,
  Table
} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class childComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      activate: true,
      date: "",
      text1: "Reschedule"
    }
    this.changeUserEnterPwd = this.changeUserEnterPwd.bind(this);
    this.checkForDateAlert = this.checkForDateAlert.bind(this);
    this.checkForDateAlert1 = this.checkForDateAlert1.bind(this);
  }

  componentWillMount(){
    let date = this.props.PreferredDate;
    let a = date.split('/');
    a.reverse();
    date = a.join('-');
    let time;
    if(this.props.PreferredTime == '09:00-11:00'){
      time = '09:00-11:00';
    }
    else if(this.props.PreferredTime == '11:00-13:00'){
      time = '11:00-13:00';
    }
    else if(this.props.PreferredTime == '14:00-16:00'){
      time = '14:00-16:00';
    }
    else if(this.props.PreferredTime == '16:00-18:00'){
      time = '16:00-18:00';
    }
    this.setState({date:date,value:time});

    let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd,
      mm;
    dd = (('' + (d.getDate())).length == 2)
      ? (d.getDate())
      : '0' + (d.getDate());
    mm = (('' + d.getMonth()).length == 2)
      ? (d.getMonth() + 1)
      : '0' + (d.getMonth() + 1);
    let date1 = d.getFullYear() + '-' + mm + '-' + dd;

    this.setState({date1:date1});
  }
  openHandleEdit = () => this.setState({activate: true})
  closeHandleEdit1 = () => {
    this.setState({activate: false});
    this.props.closeActive2();
  }
  closeHandleEdit = () => {
    location.reload();
  }
  handleChange = (e, {value}) => this.setState({value})
  reScheduleAppointment() {
    var test = 0;
    var context = this;
    var count1 =0;
    if(new Date(this.state.date) > new Date()){
      var d = this.state.date;
      let a = d.split('-');
      a.reverse();
      var date = a.join('/');
      this.props.profile[0].AppointmentRecord.map(function(item, key) {
        if(date == item.PreferredDate){
          if(context.state.value == item.PreferredTime && item.Status != 'Cancelled'){
            test = test +1;
          }else{
              count1 = 0;
          }
        }else{
              count1 =0;
        }
      });

  if(test == 0 && count1 == 0){
    var pid = cookies.get('username');
    var aid = this.props.aid;
    var phid = this.props.phid;
    var date = this.state.date;
    let a = date.split('-');
    a.reverse();
    date = a.join('/');
    var time = this.state.value;
    $.ajax({
      url: "/patients/reScheduleAppointment",
      type: 'POST',
      data: {
        pid: pid,
        aid: aid,
        phid:phid,
        date: date,
        time: time
      },
      success: function(data) {
        this.setState({text1: "Rescheduled"});
        this.refs.asd.success(' Rescheduled successfully', '', {
          timeOut: 1000,
          extendedTimeOut: 1000
        });
        setTimeout(this.closeHandleEdit,1000);
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }
  else{
      this.checkForDateAlert1();
  }
  }else{
    this.checkForDateAlert();
  }
  }
  checkForDateAlert1(){
    let context = this;
    this.refs.asd.warning(
      'You already have appointment for this slot',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  }
  checkForDateAlert(){
    let context = this;
    this.refs.asd.warning(
      'Please select a future date',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  }
  changeUserEnterPwd(e) {
    let date = e.target.value;
    this.setState({date: date});
  }
  render() {
    const {activate} = this.state
    return (
      <div>
        <Dimmer active={activate} page>
          <Card style={{
            color: 'black',
            margin: '0 auto'
          }}>
          <Icon name='cancel' style={{float:'left'}} onClick={this.closeHandleEdit1.bind(this)} id='closeIconPosition'/>
            <label className="control-label" for="date" style={{
              textAlign: 'left',
              marginTop: '3%',
              marginLeft: '3%'
            }}>Appointment date</label>
            <input className="form-control" type="date" min={this.state.date1} style={{
              marginLeft: '15%',
              width: '80%',
              borderColor: 'orange'
            }} onChange={this.changeUserEnterPwd} value={this.state.date}/>
            <Form style={{
              marginTop: '3%'
            }}>
              <Form.Field style={{
                textAlign: '-webkit-left',
                marginLeft: '3%'
              }}>
                <b style={{
                  textAlign: 'left'
                }}>Appointment time</b>
              </Form.Field>
              <Form.Field style={{
                textAlign: '-webkit-left',
                marginLeft: '15%'
              }}>
                <Radio label='09:00-11:00' name='radioGroup' style={{
                  borderColor: 'orange'
                }} value='09:00-11:00' checked={this.state.value === '09:00-11:00'} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field style={{
                textAlign: '-webkit-left',
                marginLeft: '15%'
              }}>
                <Radio label='11:00-13:00' name='radioGroup' value='11:00-13:00' checked={this.state.value === '11:00-13:00'} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field style={{
                textAlign: '-webkit-left',
                marginLeft: '15%'
              }}>
                <Radio label='14:00-16:00' name='radioGroup' value='14:00-16:00' checked={this.state.value === '14:00-16:00'} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field style={{
                textAlign: '-webkit-left',
                marginLeft: '15%'
              }}>
                <Radio label='16:00-18:00' name='radioGroup' value='16:00-18:00' checked={this.state.value === '16:00-18:00'} onChange={this.handleChange}/>
              </Form.Field>
            </Form>
            <div className="form-group">
              <Button inverted color='orange' name="submit" type="submit" onClick={this.reScheduleAppointment.bind(this)}>{this.state.text1}</Button>
              <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
                marginTop: '8%'
              }}/>
            </div>
          </Card>
        </Dimmer>
      </div>
    );
  }
}

module.exports = childComponent;
