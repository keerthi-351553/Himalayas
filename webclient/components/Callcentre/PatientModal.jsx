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
  Radio,
  Dropdown,
  Popup
} from 'semantic-ui-react'
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import {Scrollbars} from 'react-custom-scrollbars';
import Map from './Map'
export default class PatientModal extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true,
      FixFlag: 0,
      FixAppointment: [],
      Fulldata: [],
      UniqueAppointmentCount: 0,
      cancelModal: false,
      CurrentItem: {},
      RescheduleFlag: 0,
      DefaultDate: '',
      DefaultTime: '',
      column: null,
      direction: null,
      MapModal: false,
      CurrentDate: '',
      AppointmentTable: [],
      CurrentDate1:''
    }
    this.fixAppointmentFlag = this.fixAppointmentFlag.bind(this);
    this.fixAppointment = this.fixAppointment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.appointmentAlert = this.appointmentAlert.bind(this);
    this.emptyFields = this.emptyFields.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.cancelAlert = this.cancelAlert.bind(this);
    this.rescheduleAppointmentFlag = this.rescheduleAppointmentFlag.bind(this);
    this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
    this.rescheduledAlert = this.rescheduledAlert.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.openMapModal = this.openMapModal.bind(this);

  }
  componentWillMount() {
    let Data = [];
    let context = this;
    context.setState({AppointmentTable: this.props.data.Appointments});
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
    today = dd + '/' + mm + '/' +yyyy;

    context.setState({
      CurrentDate1: today
    });

  }
  handleChange = (e, {value}) => this.setState({value})
  handleOpen = () => this.setState({active: true})
  handleSort = clickedColumn => () => {
    const {column, direction, AppointmentTable} = this.state
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        AppointmentTable: _.sortBy(AppointmentTable, [clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      AppointmentTable: AppointmentTable.reverse(),
      direction: direction === 'ascending'
        ? 'descending'
        : 'ascending'
    })
  }
  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
    this.setState({CurrentItem: {}});
  }
  openCancelModal(item) {
    let context = this;
    context.setState({cancelModal: true});
    context.setState({CurrentItem: item});
  }

  closeModal() {
    let context = this;
    context.setState({cancelModal: false});
    this.setState({CurrentItem: {}});
  }
  openMapModal(item) {
    this.setState({MapModal: true});
    this.setState({CurrentItem: item});
  }
  closeMapModal() {
    this.setState({MapModal: false});
    this.setState({CurrentItem: {}});
  }

  fixAppointmentFlag() {
    //this.setState({active: false});
    this.setState({FixFlag: 1});
    let DataArray = [];
    let today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    DataArray.push(this.props.data);
    this.setState({FixAppointment: DataArray});
    this.setState({CurrentDate: today});
    this.setState({FullData: this.props.FullData});
    this.setState({DefaultDate: today});
  }
  fixAppointment() {
    let PatientID = this.state.FixAppointment[0].PatientID;
    let PreferredDate = this.refs.PreferredDate.value;
    let PreferredTime = this.state.DefaultTime;
    let uniqueID = '';
    let IDcount = 0;
    let context = this;
    let Data = this.state.FullData;
    let AppointmentIDArray = [];
    let pid = PatientID.substring(2);
    let fixflag = 0;
    let NewAppointmentID = '';
    let PA = PatientID.replace('PA', '');
    let Max = 0;
    if (PreferredDate === '' || PreferredTime === '' || PreferredTime === undefined) {
      context.emptyFields();
    } else if (new Date(PreferredDate) < new Date()) {
      context.checkForDateAlert();
    } else {
      context.appointmentAlert();
      //  @Mayanka: generating unique number for AppointmentID
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].Appointments != '') {
          if (Data[i].PatientID === PatientID) {
            fixflag = 1;
            for (let j = 0; j < Data[i].Appointments.length; j++) {
              AppointmentIDArray.push(Data[i].Appointments[j].AppointmentID);
            }
          }
        }
      }
      let PIDlength = PatientID.length;
      if (fixflag === 1) {
        for (let i in AppointmentIDArray) {
          AppointmentIDArray[i] = AppointmentIDArray[i].replace(AppointmentIDArray[i].substring(0, PIDlength), '');
        }
        for (let i in AppointmentIDArray) {
          AppointmentIDArray[i] = parseInt(AppointmentIDArray[i]);
        }
        Max = AppointmentIDArray[0];
        for (let i in AppointmentIDArray) {
          if (Max < AppointmentIDArray[i]) {
            Max = AppointmentIDArray[i];
          }
        }
        IDcount = Max + 1;
        NewAppointmentID = 'AP' + PA + IDcount;
      } else {
        NewAppointmentID = 'AP' + PA + '1';
      }
      //  @Mayanka: Changing date to DD:MM:YYYY format
      let var1 = '';
      let var2 = '';
      let var3 = '';
      var test = 0;
      var count1 =0;
      var1 = PreferredDate.substr(0, 4);
      var2 = PreferredDate.substr(5, 2);
      var3 = PreferredDate.substr(8, 2);
      let CorrectDate = var3 + '/' + var2 + '/' + var1;
      context.props.data.Appointments.map(function(item, key) {
        if(CorrectDate == item.PreferredDate){
          if(PreferredTime == item.PreferredTime && item.Status != 'Cancelled'){
            test = test +1;
          }else{
              count1 = 0;
          }
        }else{
              count1 =0;
        }
      })

      if(test == 0 && count1 == 0){
      $.ajax({
        url: '/patients/addAppointment',
        type: 'POST',
        data: {
          PatientID: PatientID,
          AppointmentID: NewAppointmentID,
          PreferredDate: CorrectDate,
          PreferredTime: PreferredTime
        },
        success: function(data) {
          context.setState({FixAppointment: []});
          context.setState({FixFlag: 0});
          context.setState({value: ''});
          context.setState({activeItem: 'Home'});
          this.setState({active: false});
          this.props.closeModal();
          window.location.reload();
        }.bind(this),
        error: function(err) {
          console.log('error occurred on AJAX');
        }.bind(this)
      });
    }
    else{
      this.checkForDateAlert1();
    }
    }
  }
  checkForDateAlert1(){
    let context = this;
    this.refs.appointment.warning(
      'You already have appointment for this slot',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  }
  checkForDateAlert2(){
    let context = this;
    this.refs.rescheduled.warning(
      'You already have appointment for this slot',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  }
  appointmentAlert() {
    let context = this;
    this.refs.appointment.success('Added appointment', '', {
      timeOut: 20000,
      extendedTimeOut: 20000
    });
  }
  emptyFields() {
    let context = this;
    this.refs.appointment.error('Empty fields', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  emptyFieldsReschedule() {
    let context = this;
    this.refs.rescheduled.error('Empty fields', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  cancelAlert() {
    let context = this;
    this.refs.Cancel.success('Appointment cancelled', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  rescheduledAlert() {
    let context = this;
    this.refs.rescheduled.success('Appointment rescheduled', '', {
      timeOut: 20000,
      extendedTimeOut: 20000
    });
  }
  checkForDateAlert() {
    let context = this;
    this.refs.appointment.warning('Select future date', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  checkFoRescheduleAlert() {
    let context = this;
    this.refs.rescheduled.warning('Select future date', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  cancelAppointment() {
    let context = this;
    context.cancelAlert();
    $.ajax({
      url: '/patients/cancelAppointment',
      type: 'POST',
      data: {
        pid: context.props.data.PatientID,
        aid: context.state.CurrentItem.AppointmentID,
        phid: context.state.CurrentItem.AssignedPhelbo.ID
      },
      success: function(result) {
        context.setState({FixAppointment: []});
        context.setState({FixFlag: 0});
        context.setState({value: ''});
        context.setState({activeItem: 'Home'});
        context.setState({CurrentItem: {}});
        this.setState({active: false});
        this.props.closeModal();
        window.location.reload();
      }.bind(this)
    });
  }
  rescheduleAppointmentFlag(item) {
    let context = this;
    let Day = '';
    let Month = '';
    let Year = '';
    let PreferredDate = item.PreferredDate;
    let today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    Day = PreferredDate.substr(0, 2);
    Month = PreferredDate.substr(3, 2);
    Year = PreferredDate.substr(6, 4);
    let CorrectDate = Year + '-' + Month + '-' + Day;
    context.setState({RescheduleFlag: 1});
    context.setState({CurrentDate: today});
    context.setState({CurrentItem: item});
    context.setState({FullData: this.props.FullData});
    context.setState({DefaultDate: CorrectDate});
    context.setState({DefaultTime: item.PreferredTime});
  }
  rescheduleAppointment() {
    let context = this;
    var test = 0;
    var count1 = 0;
    let PatientID = context.props.data.PatientID;
    let PreferredDate = this.refs.rescheduledDate.value;
    let PreferredTime = this.state.DefaultTime;
    let AppointmentID = context.state.CurrentItem.AppointmentID;
    let var1 = '';
    let var2 = '';
    let var3 = '';
    var1 = PreferredDate.substr(0, 4);
    var2 = PreferredDate.substr(5, 2);
    var3 = PreferredDate.substr(8, 2);
    let CorrectDate = var3 + '/' + var2 + '/' + var1;
    let PhleboId = context.state.CurrentItem.AssignedPhelbo.ID;
    if (PreferredDate === '' || PreferredTime === '') {
      context.emptyFieldsReschedule()
    } else if (new Date(PreferredDate) < new Date()) {
      context.checkFoRescheduleAlert();
    } else {
      context.rescheduledAlert();
      context.props.data.Appointments.map(function(item, key) {
        if(CorrectDate == item.PreferredDate){
          if(PreferredTime == item.PreferredTime && item.Status != 'Cancelled'){
            test = test +1;
          }else{
              count1 = 0;
          }
        }else{
              count1 =0;
        }
      })
      if(test == 0 && count1 == 0){
      $.ajax({
        url: '/patients/reScheduleAppointment',
        type: 'POST',
        data: {
          pid: PatientID,
          aid: AppointmentID,
          date: CorrectDate,
          time: PreferredTime,
          phid: context.state.CurrentItem.AssignedPhelbo.ID
        },
        success: function(result) {

          context.setState({RescheduleFlag: 0});
          context.setState({value: ''});
          context.setState({CurrentItem: {}});
          context.setState({DefaultDate: ''});
          context.setState({DefaultTime: ''});
          context.setState({activeItem: 'Home'});
          this.setState({active: false});
          this.props.closeModal();
          window.location.reload();
        }.bind(this)
      });
    }
    else{
        this.checkForDateAlert2();
    }
    }
  }
  updateTime(e, a) {
    this.setState({DefaultTime: a.value});
  }
  render() {
    const {active} = this.state
    const {column, direction} = this.state
    let MapData = '';
    let context = this;
    let TableData = '';
    let DimmerData = '';
    let DefaultTime = '';
    let EditIcon = '';
    let RemoveIcon = '';
    if (this.state.DefaultTime) {
      DefaultTime = this.state.DefaultTime;
    }
    const options = [
      {
        key: '1',
        text: '09:00-11:00',
        value: '09:00-11:00'
      }, {
        key: '2',
        text: '11:00-13:00',
        value: '11:00-13:00'
      }, {
        key: '3',
        text: '14:00-16:00',
        value: '14:00-16:00'
      }, {
        key: '4',
        text: '16:00-18:00',
        value: '16:00-18:00'
      }
    ]
    if (this.props.data.Appointments != '') {
      for (let i in this.props.data.Appointments) {

        if (this.props.data.Appointments[i].Status === 'Unassigned' || this.props.data.Appointments[i].Status === 'Completed') {
          this.props.data.Appointments[i].AssignedPhelbo.Name = '--';
        }
      }
    }
    if (this.props.data.Appointments != '') {
      TableData = (
        <div style={{
          marginLeft: '5%',
          width: '90%'
        }}>
          <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
            display: 'none',
            position: 'right'
          }}/>} autoHeight autoHeightMax={350}>
            <Table fixed sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'AppointmentID'
                    ? direction
                    : null} onClick={context.handleSort('AppointmentID')} style={{
                    width: '18%'
                  }}>Appointment ID</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Test'
                    ? direction
                    : null} onClick={context.handleSort('Test')}>Test</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Status'
                    ? direction
                    : null} onClick={context.handleSort('Status')}>Status</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Date'
                    ? direction
                    : null} onClick={context.handleSort('Date')}>Date</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Time'
                    ? direction
                    : null} onClick={context.handleSort('Time')}>Time</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Assigned'
                    ? direction
                    : null} onClick={context.handleSort('Assigned')}>Assigned Phlebo</Table.HeaderCell>
                  <Table.HeaderCell style={{
                    width: '17%'
                  }}>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.AppointmentTable.map(function(item, key) {
                  MapData = '';
                  RemoveIcon = '';
                  EditIcon = '';
                  if (item.Status != 'Unassigned' && item.Status != 'Completed' && item.Status != 'Cancelled') {
                    MapData = (
                      <Popup trigger={< Image style = {{cursor:'pointer',float:'right',marginTop:'-5%'}}src = '../image/maps.png' size = 'mini' onClick = {
                        context.openMapModal.bind(context, item)
                      } />} content='Phlebo location'/>
                    )
                  }
                  if (item.Status != 'Completed' && item.Status != 'Cancelled') {
                    EditIcon = (
                      <Popup trigger={< Icon name = 'edit' style = {{cursor:"pointer"}}size = 'big' color = 'orange' onClick = {
                        context.rescheduleAppointmentFlag.bind(context, item)
                      } />} content='Reschedule Appointment'/>
                    )
                  }
                  if (item.Status != 'Completed' && item.Status != 'Cancelled') {
                    RemoveIcon = (
                      <Popup trigger={< Icon name = 'remove' style = {{cursor:"pointer"}}onClick = {
                        context.openCancelModal.bind(context, item)
                      }
                      size = 'big' color = 'orange' />} content='Cancel Appointment'/>
                    )
                  }
                  return (
                    <Table.Row>
                      <Table.Cell>{item.AppointmentID}</Table.Cell>
                      <Table.Cell>{item.Test}</Table.Cell>
                      <Table.Cell>{item.Status}</Table.Cell>
                      <Table.Cell>{item.PreferredDate}</Table.Cell>
                      <Table.Cell>{item.PreferredTime}</Table.Cell>
                      <Table.Cell style={{
                        textAlign: 'center'
                      }}>{item.AssignedPhelbo.Name}</Table.Cell>
                      <Table.Cell>
                        {RemoveIcon}
                        {EditIcon}
                        {MapData}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Scrollbars>
        </div>
      );
    }
    if (this.state.FixFlag === 1) {
      DimmerData = (
        <div>
          <ToastContainer ref='appointment' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
            marginTop: '8%'
          }}/>
          <Grid>
            <Grid.Row>
              <Grid.Column width={5}/>
              <Grid.Column width={6}>
                <Icon name='close' size='big' color='orange' onClick={this.handleClose} style={{
                  marginLeft: "100%",
                  cursor: "pointer"
                }}/>
                <Card style={{
                  width: '90%'
                }}>
                  <Label ribbon style={{
                    marginLeft: '1.5%',
                    width: '25%'
                  }} color='orange' style={{
                    marginLeft: '1.5%',
                    width: '25%'
                  }}>{this.props.data.FirstName}&nbsp;{this.props.data.LastName}</Label>
                  <Card.Content>
                    <div style={{
                      width: '70%'
                    }}>
                      <h4 style={{
                        textAlign: "right",
                        color: 'black'
                      }}>Enter Patient's Preferred Date and Time</h4>
                      <Form style={{
                        marginTop: "10%"
                      }}>
                        <Form.Field>
                          <input style={{
                            marginLeft: "35%",
                            width: "67%"
                          }} autoComplete='off' type='date' ref='PreferredDate' defaultValue={this.state.DefaultDate} min={this.state.DefaultDate} placeholder='Preferred Date'/>
                        </Form.Field><br/>
                        <Form.Field>
                          <br/>
                          <Dropdown style={{
                            marginLeft: "35%",
                            width: "40%",
                            color: "black"
                          }} value={this.state.DefaultTime} onChange={this.updateTime.bind(this)} placeholder='Appointment Time' selection options={options}/>
                        </Form.Field>
                      </Form>
                      <br/>
                      <Button inverted style={{
                        marginLeft: "30%",
                        width: "30%"
                      }} color='orange' onClick={context.fixAppointment}>Fix</Button>
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )
    }
    if (this.state.FixFlag === 0 && this.state.RescheduleFlag === 0) {
      DimmerData = (
        <div>
          <Grid>
            <Grid.Column width={3}/>
            <Grid.Column width={12}>
              <Icon name='close' size='big' color='orange' onClick={this.handleClose} style={{
                marginLeft: '-10%',
                cursor: "pointer"
              }}/>
              <Card style={{
                width: '98%',
                marginLeft: '-10%'
              }}>
                <Label ribbon style={{
                  marginLeft: '1.5%',
                  width: '25%'
                }} color='orange' style={{
                  marginLeft: '1.5%',
                  width: '25%'
                }}>{this.props.data.FirstName}&nbsp;{this.props.data.LastName}</Label><br/>
                {/* <Image src='https://d30y9cdsu7xlg0.cloudfront.net/png/22780-200.png' size='tiny' style={{
                  position: 'absolute',
                  marginLeft: '78%',
                  marginTop: '3%'
                }}/> */}
                <img className="card-img-circle  img-circle" src={this.props.data.ProfilePhoto} style={{
                  // float: 'right',
                  position: 'absolute',
                  marginLeft: '25%',
                  marginTop: '-1%',
                  height:'150px',
                  width:'150px'
                }}/>
                <Button inverted color='orange' style={{
                  position: 'absolute',
                  width: '20%',
                  marginLeft: '23%',
                  marginTop: '16%'
                }} onClick={context.fixAppointmentFlag.bind(context)}>Fix appointment</Button><br/>
                <div style={{
                  marginLeft: '10%',
                  textAlign: 'left',
                  width: '50%'
                }}>

                  <table style={{
                    color: 'black'
                  }}>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>ID</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.PatientID}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>Age</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.Age}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>Gender</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.Gender}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>Contact</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.ContactNumber}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>DOB</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.DateOfBirth}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'teal'
                      }}>Address</td>
                      <td style={{
                        width: '20%'
                      }}></td>
                      <td>{this.props.data.Address}</td>
                    </tr>
                    <tr>
                      <td style={{
                        color: 'white'
                      }}>1</td>
                    </tr>
                  </table>
                </div>

                <br/>
                <div style={{
                  marginLeft: '0%'
                }}>
                  {TableData}
                </div>
                <br/>
              </Card>
            </Grid.Column>
            <Grid.Column width={3}/>
          </Grid>
        </div>
      )
    } else if (this.state.RescheduleFlag === 1) {
      DimmerData = (
        <div>
          <ToastContainer ref='rescheduled' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
            marginTop: '8%'
          }}/>
          <Grid>
            <Grid.Row>
              <Grid.Column width={5}/>
              <Grid.Column width={6}>
                <Icon name='close' size='big' color='orange' onClick={this.handleClose} style={{
                  marginLeft: "100%",
                  cursor: "pointer"
                }}/>
                <Card style={{
                  width: '90%'
                }}>
                  <Label ribbon style={{
                    marginLeft: '1.5%',
                    width: '25%'
                  }} color='orange' style={{
                    marginLeft: '1.5%',
                    width: '25%'
                  }}>{this.props.data.FirstName}&nbsp;{this.props.data.LastName}</Label>
                  <Card.Content>
                    <div style={{
                      width: '70%',
                      color: 'black'
                    }}>
                      <h4 style={{
                        textAlign: "right",
                        color: 'black'
                      }}>Enter Patient's Preferred Date and Time</h4>
                      <Form style={{
                        marginTop: "10%"
                      }}>
                        <Form.Field>
                          <input style={{
                            marginLeft: "35%",
                            width: "67%"
                          }} autoComplete='off' type='date' ref='rescheduledDate' defaultValue={this.state.DefaultDate} min={this.state.CurrentDate} placeholder='Preferred Date'/>
                        </Form.Field><br/>
                        <Form.Field>
                          <br/>
                          <Dropdown style={{
                            marginLeft: "35%",
                            width: "40%"
                          }} defaultValue={DefaultTime} onChange={this.updateTime.bind(this)} placeholder='Appointment Time' selection options={options}/>
                        </Form.Field>
                      </Form>
                      <br/>
                      <Button inverted style={{
                        marginLeft: "30%"
                      }} color='orange' onClick={context.rescheduleAppointment.bind(context, this)}>Reschedule</Button>
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )
    }

    return (
      <Dimmer active={active} page>
        {DimmerData}
        {this.state.MapModal
          ? <Map PhleboID={this.state.CurrentItem.AssignedPhelbo.ID} PatientAddress={this.props.data.Address} closeMapModal={this.closeMapModal.bind(this)}/>
          : null}
        <Dimmer active={this.state.cancelModal} onClickOutside={this.closeModal.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <div>
            <ToastContainer ref='Cancel' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
              marginTop: '8%',
              marginLeft: '50%'
            }}/>
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}/>
                <Grid.Column width={6}>
                  <Icon name='close' size='big' color='orange' onClick={this.handleClose} style={{
                    marginLeft: "100%",
                    cursor: "pointer"
                  }}/>
                  <Card style={{
                    width: '90%'
                  }}>
                    <Label ribbon style={{
                      marginLeft: '1.5%',
                      width: '25%'
                    }} color='orange' style={{
                      marginLeft: '1.5%',
                      width: '25%'
                    }}>{this.props.data.FirstName}&nbsp;{this.props.data.LastName}</Label>
                    <Card.Content>
                      <Header icon='remove outline' content='Cancel appointment' style={{
                        color: 'black',
                        marginLeft: '15%'
                      }}/>
                      <p style={{
                        color: 'black'
                      }}>Are you sure you want to cancel this appointment?</p><br/>
                      <Button color='red' inverted onClick={this.closeModal.bind(this)} style={{
                        marginLeft: '0%',
                        marginRight: '1%'
                      }}>
                        <Icon name='remove'/>
                        No
                      </Button>
                      <Button color='green' inverted onClick={this.cancelAppointment.bind(this)}>
                        <Icon name='checkmark'/>
                        Yes
                      </Button>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Dimmer>
      </Dimmer>
    );
  }
}
