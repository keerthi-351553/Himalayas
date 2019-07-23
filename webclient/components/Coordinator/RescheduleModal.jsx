import React from 'react';
import {
  Dimmer,
  Header,
  Icon,
  Segment,
  Grid,
  Image,
  Card,
  Label,
  Button,
  Form,
  Dropdown
} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class RescheduleModal extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true,
      date:'',
      newDate:'',
      time:'',
      newTime:'',
      CurrentDate:''
    }
    this.checkForRescheduledAlert = this.checkForRescheduledAlert.bind(this);
  }

  componentWillMount(){

    let date = this.props.appointment.PreferredDate;
    let a = date.split('/');
    a.reverse();
    date = a.join('-');
    let time;
    if(this.props.appointment.PreferredTime == '09:00-11:00'){
      time = '0';
    }
    else if(this.props.appointment.PreferredTime == '11:00-13:00'){
      time = '1';
    }
    else if(this.props.appointment.PreferredTime == '14:00-16:00'){
      time = '2';
    }
    else if(this.props.appointment.PreferredTime == '16:00-18:00'){
      time = '3';
    }
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
    today = yyyy+ '-' + mm + '-' + dd;
    this.setState({
      CurrentDate: today
    });
    this.setState({date:date,time:time,newDate:this.props.appointment.PreferredDate,newTime:this.props.appointment.PreferredTime});
  }

  handleOpen = () => this.setState({active: true})

  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
  }
  updateDate(e) {
    let a = e.target.value.split('-');
    a.reverse();
    this.setState({date:e.target.value,newDate: a.join('/')});
  }
  updateTime(e,a) {
    let time;
    if(a.value == '0'){
      time = '09:00-11:00';
    }
    else if(a.value == '1'){
      time = '11:00-13:00';
    }
    else if(a.value == '2'){
      time = '14:00-16:00';
    }
    else if(a.value == '3'){
      time = '16:00-18:00';
    }
    this.setState({time: a.value,newTime:time});
  }

  reschedule(){
    let context = this;
    var test = 0;
    var count1 =0;
    if(new Date(this.state.date) > new Date()){
      context.props.allAppointments.map(function(item, key) {
        if(context.state.newDate == item.PreferredDate){
          if(context.state.newTime == item.PreferredTime && item.Status != 'Cancelled'){
            test = test +1;
          }else{
              count1 = 0;
          }
        }else{
              count1 =0;
        }
      });

  if(test == 0 && count1 == 0){

      $.ajax({
        url: '/patients/reScheduleAppointment',
        type: 'POST',
        data:{
          pid: context.props.appointment.PaId,
          aid: context.props.appointment.AppointmentID,
          date: context.state.newDate,
          time: context.state.newTime,
          phid:context.props.appointment.AssignedPhelbo.ID
        },
        success: function(result) {
          context.checkForRescheduledAlert();
        }.bind(this)
      });
    }
    else{
        this.checkForDateAlert1();
    }
  }
    else{
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
      'You can not select the current or past date',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  }

  checkForRescheduledAlert(){
    let context = this;
    this.refs.asd.success(
      'Rescheduled successfully',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  setTimeout(this.reload,2000);
  }

  reload(){
    location.reload();
  }

  render() {
    const {active} = this.state;
    const options = [
      {
        key: '1',
        text: '09:00-11:00',
        value: '0'
      }, {
        key: '2',
        text: '11:00-13:00',
        value: '1'
      }, {
        key: '3',
        text: '14:00-16:00',
        value: '2'
      }, {
        key: '4',
        text: '16:00-18:00',
        value: '3'
      }
    ]
    var context = this;
    return (
      <Dimmer active={active} page>
        <Grid>
          <Grid.Column width={6}></Grid.Column>
          <Grid.Column width={4}>
            <Card>
              <Icon name='cancel' style={{float:'left'}} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
              <Label color='orange' ribbon style={{marginLeft:'5%',width:'50%'}}>{this.props.appointment.AppointmentID}</Label>
              <Card.Content>
                <Form>
                  <Form.Field onChange={this.updateDate.bind(this)}>
                    <label>Appointment Date</label>
                    <input value={this.state.date} type='date' placeholder='Appointment Date' min={this.state.CurrentDate}/>
                  </Form.Field>
                  <Form.Field>
                    <br />
                    <label>Appointment Time</label>
                    <Dropdown value={this.state.time} onChange={this.updateTime.bind(this)} placeholder='Appointment Time' selection options={options}/>
                  </Form.Field>
                  <br/>
                  <Button inverted color='orange' onClick={this.reschedule.bind(this)}>Confirm</Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        <ToastContainer ref='asd'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-center' style={{marginTop:'8%'}} />
      </Dimmer>
    );
  }
}

module.exports = RescheduleModal;
