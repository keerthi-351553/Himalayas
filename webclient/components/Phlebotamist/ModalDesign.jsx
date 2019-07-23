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
  TextArea
} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import PhleboMap from './PhleboMap.jsx';
class Component2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      dcModal: false,
      ciModal: false,
      coModal: false,
      status: props.appoinment.Status,
      mesModal:false,
      message:'',
      CheckInButton: (
        <Button inverted color='green' style={{
          display: props.displayStatus,
        }} onClick={this.checkInClick.bind(this)}>CheckIn</Button>
      ),
      lat: 0.0,
      lng: 0.0,
      MapModal:false
    }
    this.checkForCheckedInSuccessfullyAlert = this.checkForCheckedInSuccessfullyAlert.bind(this);
    this.getLatitudeLongitude = this.getLatitudeLongitude.bind(this);
    this.showResult = this.showResult.bind(this);
this.openMapModal = this.openMapModal.bind(this);
  }
  checkForSendAlert(){
    let context = this;
    this.refs.asd.success(
      'Message Sent successfully',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
}
  componentWillMount() {
    let address = this.props.appoinment.PaAddress;
    this.getLatitudeLongitude(this.showResult, address);
  }

  showResult(result) {
    this.setState({lat: result.geometry.location.lat()});
    this.setState({lng: result.geometry.location.lng()});
  }
  getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          callback(results[0]);
        }
      });
    }
  }

  checkForCheckedInSuccessfullyAlert() {
    this.setState({activeLoader: false});
    let context = this;
    this.refs.asd.success('Checked in successfully', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  checkForCheckedInSuccessfullyAfterAlert() {
    this.setState({activeLoader: false});
    let context = this;
    this.refs.asd.warning('please check out to proceed', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  checkforcheckInAlert(){
    let context = this;
    this.refs.asd.warning('please check in for the current date', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  handleOpen = () => {
    this.setState({active: true});
  }
  handleClose = () => {
    if (this.state.status != 'Checked In') {
      this.setState({active: false});
      this.props.closeModal();
    } else {
      this.checkForCheckedInSuccessfullyAfterAlert();
    }
  }
  cancelClick(PatientID, AppointmentID, date1) {
    this.setState({dcModal: true});
  }
  handleNoDeleteComponentClick() {
    this.setState({dcModal: false});
  }
  handleYesDeleteComponentClick(PatientID, AppointmentID, date1) {
    let context = this;
    let data = {
      phleboId: cookies.get('loginid'),
      appointmentID: AppointmentID,
      patientID: PatientID,
      date: date1
    };
    $.ajax({
      url: '/phlebotomist/cancelPhlebo',
      type: 'POST',
      data: data,
      success: function(res) {
        // alert("deleted successfully");
        context.props.cancelCard(AppointmentID, false);
      },
      error: function(err) {
        console.log("Error occured", err);
      }
    });
  }
  checkInClick() {
    let d2 = new Date();
    let dd = '';
    if((d2.getDate())>9) {
      dd = d2.getDate();
    }
    else{
      dd = '0'+ (d2.getDate());
    }
    let mm = '';
    if((d2.getMonth()+1)>9) {
      mm = d2.getMonth()+1;
    }
    else{
      mm = '0'+ (d2.getMonth()+1);
    }
    let yyyy = d2.getFullYear()
    let currentDate = (dd+'/'+mm+'/'+yyyy);
    if(this.props.appoinment.PreferredDate == currentDate) {
      this.setState({ciModal: true});
    }
    else{
      this.checkforcheckInAlert();
    }
  }
  handleNoCheckInClick() {
    this.setState({ciModal: false});
  }
  handleYesCheckInClick(PatientID, AppointmentID, date1) {
    let context = this;
    let data = {
      phleboId: cookies.get('loginid'),
      appointmentID: AppointmentID,
      patientID: PatientID,
      date: date1,
      lat:this.state.lat,
      lng:this.state.lng
    };
    $.ajax({
      url: '/phlebotomist/CheckInStatus',
      type: 'POST',
      data: data,
      success: function(res) {
        // alert("checked in successfully");
        context.props.disableCancel('none');
        context.checkForCheckedInSuccessfullyAlert();
        context.setState({
          CheckInButton: (
            <Button inverted color='green' style={{}} onClick={context.checkOutClick.bind(context)}>CheckOut</Button>
          )
        }, function() {
          context.setState({ciModal: false, status: 'Checked In'});
        });
      },
      error: function(err) {
        console.log("Error occured", err);
      }
    });
  }
  checkOutClick() {
    this.setState({coModal: true});
  }
  handleNoCheckOutClick() {
    this.setState({coModal: false});
  }
  handleYesCheckOutClick(PatientID, AppointmentID, date1) {
    let context = this;
    let data = {
      phleboId: cookies.get('loginid'),
      appointmentID: AppointmentID,
      patientID: PatientID,
      date: date1
    };
    $.ajax({
      url: '/phlebotomist/CheckOutStatus',
      type: 'POST',
      data: data,
      success: function(res) {
        // alert("checked out successfully");
        context.setState({
          coModal: false,
          status: 'Completed'
        }, function() {
          context.props.CheckOutStatus(AppointmentID, false);
        });
      },
      error: function(err) {
        console.log("Error occured", err);
      }
    });
  }
  openMapModal() {
    this.setState({MapModal: true});
  }
closeModal(){
  this.setState({MapModal: false});
}
openMessageModal(){
  this.setState({mesModal:true});
}
handleNoMessageModalClick(){
  this.setState({mesModal:false});
}
handleYesMessageModalClick(){
  let context = this;
  $.ajax({
    url: '/patients/sendMessage',
    type: 'POST',
    data:{
      pid: context.props.appoinment.PaId,
      Message:context.state.message
    },
    success: function(result) {
      context.checkForSendAlert();
      context.setState({mesModal:false});
    }.bind(this)
  });
}
message(e,a){
  this.setState({message:a.value});
}
  render() {
    const {active} = this.state
    var context = this;
    return (
      <div>
        {this.state.MapModal
          ? <PhleboMap lat={this.state.lat} lng={this.state.lng} closeModal={this.closeModal.bind(this)}/>
          : null}
          <Dimmer active={this.state.mesModal} onClickOutside={this.handleNoMessageModalClick.bind(this)} page>
            <Card style={{margin:'auto'}}>
              <Label color='orange' ribbon style={{marginLeft:'5%',width:'50%'}}>{this.props.appoinment.PaName}</Label>
              <Card.Content>
                <TextArea style={{float:'left',width:'87%',color:'black'}} onChange={this.message.bind(this)} placeholder='Type your message here'/>
                <Icon name='send' size='large' color='orange' style={{float:'right',cursor:'pointer'}} onClick={this.handleYesMessageModalClick.bind(this)}/>
              </Card.Content>
            </Card>
          </Dimmer>
        <Dimmer active={this.state.dcModal} onClickOutside={this.handleNoDeleteComponentClick.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <Header icon='cancel' content='Cancel Appointment???' style={{
            color: 'white',
            marginLeft: '21%',
            fontSize: '100%'
          }}/>
          <Button color='red' inverted onClick={this.handleNoDeleteComponentClick.bind(this)} style={{
            marginLeft: '10%',
            marginRight: '1%'
          }}>
            <Icon name='remove'/>
            No
          </Button>
          <Button color='green' inverted onClick={this.handleYesDeleteComponentClick.bind(this, this.props.appoinment.PaId, this.props.appoinment.AppointmentID, this.props.appoinment.PreferredDate)}>
            <Icon name='checkmark'/>
            Yes
          </Button>
        </Dimmer>
        <Dimmer active={this.state.ciModal} onClickOutside={this.handleNoCheckInClick.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <Header icon='hand outline right' content='Check in?' style={{
            color: 'white',
            marginLeft: '21%',
            fontSize: '100%'
          }}/>
          <Button color='red' inverted onClick={this.handleNoCheckInClick.bind(this)} style={{
            marginLeft: '10%',
            marginRight: '1%'
          }}>
            <Icon name='remove'/>
            No
          </Button>
          <Button color='green' inverted onClick={this.handleYesCheckInClick.bind(this, this.props.appoinment.PaId, this.props.appoinment.AppointmentID, this.props.appoinment.PreferredDate)}>
            <Icon name='checkmark'/>
            Yes
          </Button>
        </Dimmer>
        <Dimmer active={this.state.coModal} onClickOutside={this.handleNoCheckOutClick.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <Header icon='hand outline left' content='Check out?' style={{
            color: 'white',
            marginLeft: '21%',
            fontSize: '100%'
          }}/>
          <Button color='red' inverted onClick={this.handleNoCheckOutClick.bind(this)} style={{
            marginLeft: '10%',
            marginRight: '1%'
          }}>
            <Icon name='remove'/>
            No
          </Button>
          <Button color='green' inverted onClick={this.handleYesCheckOutClick.bind(this, this.props.appoinment.PaId, this.props.appoinment.AppointmentID, this.props.appoinment.PreferredDate)}>
            <Icon name='checkmark'/>
            Yes
          </Button>
        </Dimmer>
        <Dimmer active={active} page>
          <Grid>
            <Grid.Column width={3}></Grid.Column>
            <Grid.Column width={10}>
              <Card style={{
                width: '100%'
              }}>
                <Icon name='cancel' style={{float:'left'}} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
                <Label color='teal' ribbon style={{
                  marginLeft: '4.5%'
                }}>{this.props.appoinment.AppointmentID}</Label>
                <Card.Content>
                  <div style={{
                    textAlign: 'left',
                    float: 'left'
                  }}>

                    {/* <p style={{
                      color: 'orange',
                      fontSize: '18px'
                    }}> */}
                    <p style={{color:'orange',fontSize:'150%'}}>Appointment Details</p>
                  {/* </p> */}
                    {/* <p style={{
                      color: 'teal'
                    }}> */}
                    <table style={{width:'100%',color:'teal',fontSize:'110%'}}>
                    <tr><td style={{padding:'3%'}}>Service type </td><td>{this.props.appoinment.Test}</td></tr>
                    <tr><td style={{padding:'3%'}}>Date </td><td>{this.props.appoinment.PreferredDate}</td></tr>
                    <tr><td style={{padding:'3%'}}>Time </td><td>{this.props.appoinment.PreferredTime}</td></tr>
                    <tr><td style={{padding:'3%'}}>Status </td><td>{this.state.status}</td></tr>
                  </table>

                    <p style={{color:'orange',float:'left',fontSize:'150%'}}>Patient Details</p><Icon style={{
                      float: 'right',
                      cursor: 'pointer',
                      color:'orange',
                      display: this.props.mesDisplay
                    }} name='mail' size='large' onClick={this.openMessageModal.bind(this)}/>
                    <table style={{width:'100%',color:'teal',fontSize:'110%',marginBottom:'5%'}}>
                    <tr><td style={{padding:'3%'}}>ID </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaId}</td><td><Image style={{
                      cursor: 'pointer',float:'right',display:this.props.mapStatus
                    }} src='../image/maps.png' size='small' onClick={this.openMapModal.bind(this)}/></td></tr>
                    <tr><td style={{padding:'3%'}}>Name </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaName}</td></tr>
                    <tr><td style={{padding:'3%'}}>Age </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaAge}</td></tr>
                    <tr><td style={{padding:'3%'}}>Gender </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaGender}</td></tr>
                    <tr><td style={{padding:'3%'}}>Contact number </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaContact}</td></tr>
                    <tr><td style={{padding:'3%'}}>Address </td><td style={{paddingLeft:'17%'}}>{this.props.appoinment.PaAddress}</td></tr>



                  </table>
                    <p style={{float:'left'}}>{this.state.CheckInButton}</p>
                    <Button inverted color='orange' style={{
                      float: 'right',
                      display: this.props.displayStatusOfDeallocate
                    }} onClick={this.cancelClick.bind(this)}>Deallocate</Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={3}></Grid.Column>
          </Grid>
        </Dimmer>
        <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-bottom-center'/>
      </div>
    );
  }
}
module.exports = Component2;
