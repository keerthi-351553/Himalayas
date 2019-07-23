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
      active: true,
      date: "",
      text1: "Schedule",
      status: true,
      date1: ""
    }
    this.changeUserEnterPwd = this.changeUserEnterPwd.bind(this);
    this.checkForDateAlert = this.checkForDateAlert.bind(this);
    this.checkForDateAlert1 = this.checkForDateAlert1.bind(this);
  }
  handleOpen = () => this.setState({active: true})
  handleClose = () => {
    location.reload();
  }
  handleClose1 = () => {
    this.setState({active: false});
    this.props.createActive2();
  }

  handleChange = (e, {value}) => {
    this.setState({value})
    if (this.state.date != '' && value != undefined) {
      this.setState({status: false});
    }
  }
  componentWillMount() {
    let d = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd,
      mm;
    dd = (('' + (d.getDate())).length == 2)
      ? (d.getDate())
      : '0' + (d.getDate());
    mm = (('' + d.getMonth()).length == 2)
      ? (d.getMonth() + 1)
      : '0' + (d.getMonth() + 1);
    let date = d.getFullYear() + '-' + mm + '-' + dd;

    this.setState({date: date});
    this.setState({date1: date});
  }
  scheduleAppointment() {
    var test = 0;
    var count1 = 0;
    var context = this;
    if (new Date(this.state.date) > new Date()) {
      var d = this.state.date;
      let a = d.split('-');
      a.reverse();
      var date = a.join('/');
      this.props.profile[0].AppointmentRecord.map(function(item, key) {
        if (date == item.PreferredDate) {
          if (context.state.value == item.PreferredTime && item.Status != 'Cancelled') {
            test = test + 1;
          } else {
            count1 = 0;
          }
        } else {
          count1 = 0;
        }
      });

      if (test == 0 && count1 == 0) {
        var pid = cookies.get('username');
        var count = this.props.count;
        count = count + 1;
        var uid = this.props.uid;
        var aid = "AP" + uid + count;
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
            this.refs.asd.success('Appointment submitted', '', {
              timeOut: 1000,
              extendedTimeOut: 1000
            });
            setTimeout(this.handleClose,1000);
          }.bind(this),
          error: function(err) {
            console.log('error occurred on AJAX');
          }.bind(this)
        });
      } else {
        this.checkForDateAlert1();
      }
    } else {
      this.checkForDateAlert();
    }
  }
  checkForDateAlert1() {
    let context = this;
    this.refs.asd.warning('You already have appointment for this slot', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }

  checkForDateAlert() {
    let context = this;
    this.refs.asd.warning('Please select a future date', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  changeUserEnterPwd(e) {
    let date = e.target.value;
    this.setState({date: date});
    if (date != '' && this.state.value != undefined) {
      this.setState({status: false});
    }
  }
  render() {
    const {active} = this.state
    return (
      <div>
        <Dimmer active={active} page>
          <Card style={{
            color: 'black',
            margin: '0 auto'
          }}>
            <h3>Appointments</h3>
            <Icon name='cancel' style={{
              float: 'left'
            }} onClick={this.handleClose1.bind(this)} id='closeIconPosition'/>
            <label className="control-label" for="date" style={{
              textAlign: 'left',
              marginTop: '3%',
              marginLeft: '3%'
            }}>Appointment date</label>
            <input className="form-control" id="date" name="date" type="date" min={this.state.date1} style={{
              marginLeft: '15%',
              width: '80%',
              borderColor: 'orange'
            }} onChange={this.changeUserEnterPwd} value={this.state.date} validations={['required']}/>

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
              <Button inverted color='orange' name="submit" type="submit" disabled={this.state.status} onClick={this.scheduleAppointment.bind(this)}>{this.state.text1}</Button>
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
