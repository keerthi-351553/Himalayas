import ReactDOM from 'react-dom';
import React, {Component} from 'react'
const {hashHistory} = require('react-router');
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import ReactTable from 'react-table';
const Map = require('./Map.jsx');

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
const editAppointment = require('./editAppointment.jsx');
const CreateAppointment = require('./createAppointment.jsx');
const EditAppointment = require('./editAppointment.jsx');
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class childComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      arr: [],
      profile: [],
      date: "",
      time: "",
      item: {},
      aid: 100,
      active1: false,
      count: 0,
      active3: false,
      message: "",
      phid: ""
    }
    this.changeUserEnterPwd = this.changeUserEnterPwd.bind(this);
    this.viewParticularAppointment = this.viewParticularAppointment.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  componentWillMount() {
    this.loadData();
  }

  sortNumber(a, b) {
    return a - b;
  }
  MapModal(){
    this.setState({active4:true});
  }
  loadData() {
    var pid = cookies.get('username');
    var arr = [];
    var count = 0;
    var temp = [];
    var dateArr = [];
    var i = 0;
    $.ajax({
      url: "/patients/viewAppointment",
      type: 'POST',
      async: false,
      data: {
        pid: pid
      },
      success: function(data) {
        this.setState({message: data[0].Message})
        this.setState({profile: data})
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
            arr: arr,
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

  handleOpen = () => this.setState({active: true})
  handleClose = () => this.setState({active: false})
  handleChange = (e, {value}) => this.setState({value})
  openHandleEdit = () => this.setState({activate: true})
  closeHandleEdit = () => {
    this.setState({activate: false});
    this.setState({activate1: false});
  }
  openHandleView = (item) => {
    var aid = item.original.AppointmentID;
    this.viewParticularAppointment(aid);
    this.setState({activate1: true});
  }
  closeHandleView = () => this.setState({activate1: false})
  openHandleDelete = () => this.setState({activate2: true})
  closeHandleDelete = () => {
    this.setState({activate2: false})
    location.reload();
  }
  profile() {
    hashHistory.push('/PatientProfile');
  }

  notToCancel() {
    this.setState({activate2: false})
  }
  cancelAppointment() {
    var pid = cookies.get('username');
    let aid = this.state.aid;
    let phid = this.state.phid;
    $.ajax({
      url: "/patients/cancelAppointment",
      type: 'POST',
      data: {
        pid: pid,
        aid: aid,
        phid: phid
      },
      success: function(data) {
        this.refs.asd.success(' Cancelled successfully', '', {
          timeOut: 3000,
          extendedTimeOut: 3000
        });
        setTimeout(this.closeHandleDelete, 2000);
      }.bind(this),
      error: function(err) {
      }.bind(this)
    });
  }

  changeUserEnterPwd(e) {
    let date = e.target.value;
    this.setState({date: date});
  }

  viewParticularAppointment(aid) {
    this.setState({aid: aid});
    var pid = cookies.get('username');
    $.ajax({
      url: "/patients/viewParticularAppointment",
      type: 'POST',
      data: {
        pid: pid,
        aid: aid
      },
      success: function(data) {
        for (var i of data[0].AppointmentRecord) {
          if (aid == i.AppointmentID) {
            this.setState({item: i})
            this.setState({phid: i.AssignedPhelbo.ID})
          }
        }
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }

  logOut() {
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  feedback() {
    var pid = cookies.get('username');
    hashHistory.push('/Feedback?aid=' + this.state.aid +'&phid='+this.state.phid+'&d='+this.state.item.PreferredDate);
  }
  cancelAppointmentTest() {
    this.setState({active3: true, activate2: true});
  }
  createAppointment() {
    this.setState({active1: true});
  }
  editAppointment() {
    this.setState({active2: true});
  }

  closeActive2(){
    this.setState({active2: false});
  }
  closeActive3(){
    this.setState({active4: false});
  }
  createActive2(){
    this.setState({active1: false});
  }
  render() {
    let name = cookies.get('username');
let patientHome = '';
    const {active} = this.state
    const {activate} = this.state
    const {activate1} = this.state
    const {activate2} = this.state
    var rowInfo = this.state.arr
    const columns = [
      {
        Header: 'Appointment ID',
        accessor: 'AppointmentID'
      }, {
        Header: 'Date',
        accessor: 'PreferredDate'
      }, {
        Header: 'Status',
        accessor: 'Status'
      }
    ]

        if(cookies.get('username')==undefined) {
        hashHistory.push('/')
        location.reload();
        }
        if(cookies.get('username').length!=0) {
          patientHome=(

            <div>
            <nav className="navbar navbar-default">
              <div className="col-xs-5 col-sm-2 col-md-1">
                <div><img src={this.state.profile[0].ProfilePhoto} className="img-responsive img-circle"  id="imgSize" style={{
            cursor: 'pointer'
          }} onClick={this.profile.bind(this)}/></div>
              </div>
              <div className="col-xs-5 col-sm-8 col-md-9" style={{
                marginTop: '7%',
                marginLeft:'-7%'
              }}>
                <p id="spacingTop">{this.state.profile[0].FirstName.lenght != 0
                    ? this.state.profile[0].FirstName + " " + this.state.profile[0].LastName
                    : null}</p>
                <p id="spacingTop">{this.state.profile[0].ContactNumber}</p>
              </div>
              <div className="col-xs-2 col-sm-2 col-md-2" id="logoutPosition">
                <Icon name="log out" style={{
                  float: 'right',
                  cursor: 'pointer'
                }} id='logout' size='large' color='orange' onClick={this.logOut.bind(this)}/>
              </div>
            </nav>
            <h3 style={{
              marginLeft: '3%',
              marginTop: '-1%',
              marginBottom: '1%'
            }}>My Appointment
              <Button circular style={{
                float: 'right',
                marginRight: '5%'
              }} icon='plus' color='orange' onClick={this.createAppointment.bind(this)}/></h3>

            {/* To create Appointment */}
            {this.state.active1 == true
              ? <CreateAppointment count={this.state.count} createActive2={this.createActive2.bind(this)} uid={this.state.uid} profile={this.state.profile}/>
              : null}
            {/* ------------------------ */}

            {/* To View Particular Appointment */}
            {this.state.profile[0].AppointmentRecord.length > 0
              ? (
                <Dimmer active={activate1} page>

                  <Card style={{
                    color: 'black',
                    margin: '0 auto'
                  }}>
                    <label style={{
                      margin: '15px 0',
                      color:'orange'
                    }}>Appointment Detail</label>
                    <Icon name='cancel' style={{float:'left'}} onClick={this.closeHandleView.bind(this)} id='closeIconPosition'/>
                    <label className="control-label" style={{
                      textAlign: 'left',
                      marginTop: '3%',
                      marginLeft: '3%'
                    }}> {this.state.item.Status != 'Completed' && this.state.item.Status != 'Checked In' && this.state.item.Status != 'Cancelled'
                        ? <div style={{
                            marginTop: '-4.5%'
                          }}>
                            <Icon name='remove' onClick={this.cancelAppointmentTest.bind(this)} style={{
                              float: 'right',
                              marginRight: '10%',
                              color: 'orange',
                              cursor: 'pointer'
                            }}/>
                            <Icon name='edit' onClick={this.editAppointment.bind(this)} style={{
                              float: 'right',
                              marginRight: '5%',
                              color: 'orange',
                              cursor: 'pointer'
                            }}/>
                          </div>
                        : null}
                        {this.state.item.Status == 'Assigned' ?
                       <div style={{marginTop:'-4.5%'}}>
                             <Icon name='globe' onClick={this.MapModal.bind(this)} style={{float:'right',marginRight:'10%',color:'orange',cursor:'pointer'}}/>
                     </div>: null }

                    </label>

                    <table style={{width:'100%',color:'teal',fontSize:'110%'}}>
                      <tr><td style={{padding:'3%',textAlign:'left'}}>Test </td><td style={{textAlign:'left',paddingLeft:'50px'}}>{this.state.item.Test}</td></tr>
                      <tr><td style={{padding:'3%',textAlign:'left'}}>Date </td><td style={{textAlign:'left',paddingLeft:'50px'}}>{this.state.item.PreferredDate}</td></tr>
                      <tr><td style={{padding:'3%',textAlign:'left'}}>Time </td><td style={{textAlign:'left',paddingLeft:'50px'}}>{this.state.item.PreferredTime}</td></tr>
                      <tr><td style={{padding:'3%',textAlign:'left'}}>Status </td><td style={{textAlign:'left',paddingLeft:'50px'}}>{this.state.item.Status}</td></tr>
                    </table>

                    {this.state.item.Status != 'Unassigned' && this.state.item.AssignedPhelbo != undefined && this.state.item.Status != 'Cancelled'
                      ? <div>
                        <table style={{width:'100%',color:'teal',fontSize:'110%'}}>
                        <tr><td style={{padding:'3%',textAlign:'left',width:'48%'}}>Phlebo Id </td><td style={{textAlign:'left'}}>{this.state.item.AssignedPhelbo.ID}</td></tr>
                        <tr><td style={{padding:'3%',textAlign:'left',width:'48%'}}>Phlebo Name </td><td style={{textAlign:'left'}}>{this.state.item.AssignedPhelbo.Name}</td></tr>
                        </table>
                        </div>
                      : null}
                    {this.state.item.Status != undefined && this.state.item.Status == 'Completed' && this.state.item.FeedbackStatus != 'Filled'
                      ?
                      <div>
                        <table style={{width:'100%',color:'teal',fontSize:'110%'}}>
                        <tr><td style={{padding:'3%',textAlign:'left',width:'43%'}}>Feedback</td><td style={{textAlign:'left'}}><button type="button" className="btn btn-link" style={{
                          color: 'orange'
                        }} onClick={this.feedback.bind(this)}>Click here</button></td></tr>
                      </table>
                    </div>:null}
                      {this.state.item.Status != undefined && this.state.item.Status == 'Completed'
                      ?
                      <div>
                        <table style={{width:'100%',color:'teal',fontSize:'110%'}}>
                        <tr><td style={{padding:'3%',textAlign:'left'}}>Report</td><td style={{textAlign:'left'}}><form method="get" action="./BloodTest_Report.doc">
                          <button type="submit" className="btn btn-link" style={{
                            color: 'orange'
                          }}>Click here</button>
                        </form></td></tr>
                        </table>
                        </div>
                      : <div style={{
                        marginBottom: '15px'
                      }}/>}
                  </Card>
                </Dimmer>
              )
              : null}
            {/* ------------------------------ */}
            {this.state.active4 ? <Map closeActive3={this.closeActive3.bind(this)} aid={this.state.aid} phid={this.state.phid} />:null}
            {/* To Edit Appointment */}
            {this.state.active2 == true
              ? <EditAppointment closeActive2={this.closeActive2.bind(this)} profile={this.state.profile} aid={this.state.aid} phid={this.state.phid} PreferredDate={this.state.item.PreferredDate} PreferredTime={this.state.item.PreferredTime}/>
              : null}
            {/* ............................. */}
            {/* To Cancel Appointment */}
            {this.state.active3 == true
              ? <Dimmer active={activate2} onClickOutside={this.closeHandleDelete.bind(this)} page>
                  <Card style={{
                    color: 'black',
                    margin: '0 auto',
                    padding: '2%'
                  }}>
                    <p style={{
                      marginRight: '3.2%'
                    }}>Do you want to cancel an Appointment?</p>
                    <div>
                      <Button color='red' inverted onClick={this.notToCancel.bind(this)} size="small">
                        <Icon name='remove'/>
                        No
                      </Button>
                      <Button color='green' inverted onClick={this.cancelAppointment.bind(this)} size="small">
                        <Icon name='checkmark'/>
                        Yes
                      </Button>
                      <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
                        marginTop: '8%'
                      }}/>
                    </div>
                  </Card>
                </Dimmer>
              : null}
            {/* ............................. */}
            {/* React table */}
            <div id="tableSize" style={{}}>
              <ReactTable className="-highlight -striped" data={this.state.arr} columns={columns} defaultPageSize={5} getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    if (handleOriginal) {

                      {
                        this.openHandleView(rowInfo)
                      }
                    }
                  }
                }
              }}/>
            </div>
            {/* ................... */}
            {/* Alert Card */}
            <div style={{
              margin: '3% 3%'
            }}>
              <Card fluid>
                <Card.Content header='My alerts'/>
                <Card.Content description={this.state.message}/>
              </Card>
            </div>
            {/* ............. */}
          </div>
        );
      }


        return (
          <div>{patientHome}
        </div>

        );
      }
    }

module.exports = childComponent;
