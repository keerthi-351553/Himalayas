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
  Table,
  Button,
  Form,
  Input,
  Dropdown
} from 'semantic-ui-react';
import RosterCard from './RosterCard';
import {Scrollbars} from 'react-custom-scrollbars';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
export default class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentDetails: [],
      phleboList: [],
      date: '',
      selectedDate: '',
      unassigned: [],
      slot1: [],
      slot2: [],
      slot3: [],
      slot4: []
    }
  }
  componentWillMount() {
    let context = this;
    let appointmentDetails = [];
    let phleboList =[];
    $.ajax({
      url: '/patients/viewPatients',
      type: 'GET',
      async: false,
      success: function(result) {
        result.map((item1) => {
          item1.AppointmentRecord.map((item) => {
            let x = {
              AppointmentID: item.AppointmentID,
              AssignedPhelbo: item.AssignedPhelbo,
              PreferredDate: item.PreferredDate,
              PreferredTime: item.PreferredTime,
              CheckIn: item.AssignedPhelbo.CheckIn,
              CheckOut: item.AssignedPhelbo.CheckOut,
              Test: item.Test,
              PaName: item1.FirstName + ' ' + item1.LastName,
              PaId: item1.PatientID,
              PaAddress: item1.Address,
              PaAge: item1.Age,
              PaContact: item1.ContactNumber,
              PaGender: item1.Gender,
              Status: item.Status
            }
            appointmentDetails.push(x);
          })
        })
        context.setState({
          appointmentDetails: appointmentDetails
        }, function() {
        });
      }.bind(this)
    });
    $.ajax({
      url: '/phlebotomist/viewPhlebo',
      type: 'GET',
      async: false,
      success: function(result) {
          result.map((item) => {
            // PhleboID : item.PhleboID
            phleboList.push(item);
            });
            context.setState({phleboList:phleboList},function(){
          });
      }.bind(this)
    });
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
    let date = yyyy+ '-' + mm + '-' + dd;
    // let date = d.getFullYear() + '-' + mm + '-' + dd;
    let selectedDate = dd + '/' + mm + '/' + yyyy;
    this.setState({
      date: date,
      selectedDate: selectedDate
    }, function() {
      this.getUnassigned();
    });
  }

  getUnassigned() {
    let unassigned = [];
    let slot1 = [{key:'0',value:'Free',text:'Free'}];
    let slot2 = [{key:'0',value:'Free',text:'Free'}];
    let slot3 = [{key:'0',value:'Free',text:'Free'}];
    let slot4 = [{key:'0',value:'Free',text:'Free'}];
    this.state.appointmentDetails.map((item, index) => {
      if (item.Status == 'Unassigned' && item.PreferredDate == this.state.selectedDate) {
        unassigned.push(item);
        if (item.PreferredTime == '09:00-11:00') {
          slot1.push({key:item.AppointmentID,value:item.AppointmentID,text:item.AppointmentID});
        } else if (item.PreferredTime == '11:00-13:00') {
          slot2.push({key:item.AppointmentID,value:item.AppointmentID,text:item.AppointmentID});
        } else if (item.PreferredTime == '14:00-16:00') {
          slot3.push({key:item.AppointmentID,value:item.AppointmentID,text:item.AppointmentID});
        } else if (item.PreferredTime == '16:00-18:00') {
          slot4.push({key:item.AppointmentID,value:item.AppointmentID,text:item.AppointmentID});
        }
      }
    })
    this.setState({
      unassigned: unassigned,
      slot1: slot1,
      slot2: slot2,
      slot3: slot3,
      slot4: slot4
    });
  }

  updateDate(e) {
    let a = e.target.value.split('-');
    a.reverse();
    this.setState({
      date: e.target.value,
      selectedDate: a.join('/')
    }, function() {
      this.getUnassigned();
    });
  }

  allocate(appointment,e,a){
    console.log('appp',appointment);
    if(new Date(this.state.date) > new Date()){
    if(a.value != 'Free'){
      let PatientID;
      let Time;
      this.state.unassigned.map((item)=>{
        if(item.AppointmentID == a.value){
          PatientID = item.PaId;
          Time = item.PreferredTime;
        }
      });
      let data = {
        PhleboID:appointment.PhleboID,
        Date:this.state.selectedDate,
        PatientID:PatientID,
        Time:Time,
        AppointmentID:a.value,
        PhleboName:appointment.FirstName+' '+appointment.LastName,
        ProfilePhoto:appointment.ProfilePhoto
      };
      let context = this;
      $.ajax({
        url: '/phlebotomist/addAllocation',
        type: 'POST',
        data: data,
        success: function(result) {
          context.checkForAllocateAlert();
        }.bind(this)
      });
    }
  }
  else{
    this.checkForDateAlert();
  }
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

  checkForAllocateAlert(){
    let context = this;
    this.refs.asd.success(
      'Allocated successfully',
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
    return (
      <Grid divided='vertically'>
        <Grid.Row>
          <Grid.Column width={2}/>
          <Grid.Column width={12}>
            <Form>
              <Form.Field onChange={this.updateDate.bind(this)}>
                <label style={{
                  color: 'orange'
                }}>Date</label>
                <input style={{
                  marginLeft: '5%',
                  marginTop: '-3%',
                  width: '25%'
                }} value={this.state.date} type='date' placeholder='Select Date' min={this.state.date}/>
              </Form.Field>
            </Form>
            <div style={{
              padding: '1%',
              backgroundColor: '#4fcfae',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px'
            }}>
              Appointment requests ({this.state.unassigned.length})
            </div>
            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
              display: 'none',
              position: 'right'
            }}/>} autoHeight autoHeightMax={150}>
              {(this.state.unassigned.length != 0)
                ? <div>{this.state.unassigned.map((item, index) => {
                      return <RosterCard appointmentDetails={item}/>
                    })}</div>
                : null}
            </Scrollbars>
            <div style={{
              clear: 'both',
              padding: '1%',
              backgroundColor: '#4fcfae',
              borderRadius: '5px',
              color: 'white',
              fontSize: '16px'
            }}>
              Phlebotomist Schedule
            </div>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{width:'15%'}} textAlign='center'>Phlebo Name</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'>09:00-11:00</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'>11:00-13:00</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'>14:00-16:00</Table.HeaderCell>
                  <Table.HeaderCell textAlign='center'>16:00-18:00</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(this.state.phleboList.map((item, index) => {
                  let m1 = 0;
                  let b1 = true;
                  let m2 = 0;
                  let b2 = true;
                  let m3 = 0;
                  let b3 = true;
                  let m4 = 0;
                  let b4 = true;
                  return <Table.Row>
                    <Table.Cell style={{width:'15%'}} textAlign='center'>{item.FirstName + ' ' + item.LastName}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.AllocationStatus.map((item1) => {
                        m1++;
                        if (item1.Date == this.state.selectedDate) {
                          b1 = false;
                          if (item1.Slot1.AppointmentID != '') {
                            return item1.Slot1.AppointmentID;
                          } else {
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot1}/>
                          }
                        }
                        else{
                          if(item.AllocationStatus.length == m1 && b1){
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot1}/>
                          }
                        }
                      })
}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.AllocationStatus.map((item1) => {
                      m2++;
                        if (item1.Date == this.state.selectedDate) {
                          b2 = false;
                          if (item1.Slot2.AppointmentID != '') {
                            return item1.Slot2.AppointmentID;
                          } else {
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot2}/>
                          }
                        }
                        else{
                          if(item.AllocationStatus.length == m2 && b2){
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot2}/>
                          }
                        }
                      })
}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.AllocationStatus.map((item1) => {
                      m3++;
                        if (item1.Date == this.state.selectedDate) {
                          b3 = false;
                          if (item1.Slot3.AppointmentID != '') {
                            return item1.Slot3.AppointmentID;
                          } else {
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot3}/>
                          }
                        }
                        else{
                          if(item.AllocationStatus.length == m3 && b3){
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot3}/>
                          }
                        }
                      })
}</Table.Cell>
                    <Table.Cell textAlign='center'>{item.AllocationStatus.map((item1) => {
                      m4++;
                        if (item1.Date == this.state.selectedDate) {
                          b4 = false;
                          if (item1.Slot4.AppointmentID != '') {
                            return item1.Slot4.AppointmentID;
                          } else {
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot4}/>
                          }
                        }
                        else{
                          if(item.AllocationStatus.length == m4 && b4){
                            return <Dropdown onChange={this.allocate.bind(this,item)} placeholder='Free' search selection options={this.state.slot4}/>
                          }
                        }
                      })
}</Table.Cell>
                  </Table.Row>
                }))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <ToastContainer ref='asd'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-center' style={{marginTop:'8%'}} />
      </Grid>

    )
  }
}
