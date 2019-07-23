const React = require('react');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
import {
  Grid,
  Table,
  Card,
  Menu,
  Label
} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import ModalDesign from './ModalDesign';
const cookies = new Cookies();
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class MyAppoinment extends React.Component {

  constructor()
  {
    super();
    this.state = {
      appoinmentDetails: [],
      modal: false,
      item:{},
      patientIDArray:[],
      cccontent:'',
      activeItem: 'Today',
      displayStatus:'',
      menuTodayClick:'aliceblue',
      menuUpcomingClick:'',
      menuCompletedClick:'',
      mapStatus:'',
      mesDisplay:'',
      currentDate:'',
      displayStatusOfDeallocate:''
    }
    this.checkForAppointmentDeletedSuccessfullyAlert = this.checkForAppointmentDeletedSuccessfullyAlert.bind(this);
    this.checkForCheckedOutSuccessfullyAlert = this.checkForCheckedOutSuccessfullyAlert.bind(this);
  }
  checkForAppointmentDeletedSuccessfullyAlert() {
      this.setState({activeLoader: false});
      let context = this;
      this.refs.asd.success(
        'Appointment deleted successfully',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
  checkForCheckedOutSuccessfullyAlert() {
      this.setState({activeLoader: false});
      let context = this;
      this.refs.asd.success(
        'Checked out successfully',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
  componentWillMount() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    if(dd<10) {
      dd = '0'+dd
    }
    if(mm<10) {
      mm = '0'+mm
    }
    today = dd+'/'+mm+'/'+yyyy;
    this.setState({currentDate:today},function(){
        this.getPatientsIDs();
    });
  }
  getPatientsIDs() {
    let data = {
      PhleboID: cookies.get('loginid')
    };
    let arr;
  let context = this;
  $.ajax({
    url: '/phlebotomist/viewPhleboAppointments',
    type: 'POST',
    data: data,
    success: function(res) {
      arr = res.filter(function(item, pos) {
          return res.indexOf(item) == pos;
        });
      context.setState({patientIDArray:arr},function() {
        context.getpatientDetails();
      });

    },
    error: function(err) {
      console.log("Error occured", err);
    }
  });
  }
  getpatientDetails(){

    let context = this;
    let appoinmentDetails = [];
    // let x ={};
    let out= [];
    context.state.patientIDArray.map((item)=>{
      appoinmentDetails = context.state.appoinmentDetails;
      let data = {
        PatientID:item
      };
      $.ajax({
        url: '/patients/viewPatientWithId',
        type: 'POST',
        data: data,
        success: function(result) {
          result.map((item1) => {
          item1.AppointmentRecord.map((item) => {
            if(cookies.get('loginid') == item.AssignedPhelbo.ID){
            let x = {
           AppointmentID: item.AppointmentID,
           AssignedPhelbo: item.AssignedPhelbo.Name,
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
           Status: item.Status,
           Paphoto:item.ProfilePhoto
           }
           appoinmentDetails.push(x);
            }
          })
        })
        context.setState({appoinmentDetails: appoinmentDetails},function(){
          context.setState({displayStatusOfDeallocate:'none',cccontent:(<Grid style={{marginLeft:'6%'}}>
          {this.state.appoinmentDetails.map((item, key) => {
            if(item.Status != 'Completed' && item.PreferredDate == this.state.currentDate){
              return (
                <Card color='purple' onClick={this.openHandle.bind(this,item)}>
                  <Label color='orange' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
                  <Card.Content>
                  <Card.Header>{item.PaName}</Card.Header>
                  <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
                  <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
                  </Card.Content>
                </Card>
              )
             }
            }
          )}
        </Grid>)});
        });
      }.bind(this),
        error: function(err) {
          console.log("Error occured", err);
        }
      });
    })

  }

  openHandle(item) {
    this.setState({modal: true,item:item},function(){
    });
  }

  closeModal() {
    this.setState({modal: false},function(){
    });
  }
  disableCancel(val){
    this.setState({displayStatus:val});
  }
  cancelCard(AppointmentID,b) {
    let z;
    let arr = this.state.appoinmentDetails;
    this.state.appoinmentDetails.map((item,index) => {
      if(item.AppointmentID == AppointmentID) {
        z = index;
      }
    });
    arr.splice(z,1);
    this.setState({appoinmentDetails:arr,modal:b,cccontent:(<Grid style={{marginLeft:'6%'}}>
    {arr.map((item, key) => {
      if(item.Status != 'Assigned'){
        return (
          <Card color='purple' onClick={this.openHandle.bind(this,item)}>
            <Label color='orange' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
            <Card.Content>
            <Card.Header>{item.PaName}</Card.Header>
            <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
            <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
            </Card.Content>
          </Card>
        )
       }
      }
    )}
  </Grid>)},function() {
      this.checkForAppointmentDeletedSuccessfullyAlert();
    });
  }
  CheckOutStatus(AppointmentID,b) {
    let arr = this.state.appoinmentDetails;
    arr.map((item,index) => {
      if(item.AppointmentID == AppointmentID) {
        item.Status="Completed";
      }
    });
    this.setState({appoinmentDetails:arr,modal:b},function() {
      this.setState({cccontent:(<Grid style={{marginLeft:'6%'}}>
      {this.state.appoinmentDetails.map((item, key) => {
        if(item.Status != 'Completed' && item.PreferredDate == this.state.currentDate){
          return (
            <Card color='purple' onClick={this.openHandle.bind(this,item)}>
              <Label color='orange' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
              <Card.Content>
              <Card.Header>{item.PaName}</Card.Header>
              <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
              <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
              </Card.Content>
            </Card>
          )
         }
        }
      )}
    </Grid>)});
      this.checkForCheckedOutSuccessfullyAlert();
    });
  }
  TodayClick(e, { name }){
     this.setState({mesDisplay:'',mapStatus:'',activeItem: name,displayStatusOfDeallocate:'none',displayStatus:'',menuTodayClick:'aliceblue',menuUpcomingClick:'',menuCompletedClick:'',cccontent:(<Grid style={{marginLeft:'6%'}}>
     {this.state.appoinmentDetails.map((item, key) => {
       if(item.Status != 'Completed' && item.PreferredDate == this.state.currentDate){
         return (
           <Card color='purple' onClick={this.openHandle.bind(this,item)}>
             <Label color='orange' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
             <Card.Content>
             <Card.Header>{item.PaName}</Card.Header>
             <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
             <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
             </Card.Content>
           </Card>
         )
        }
       }
     )}
   </Grid>) });
  }
  UpcomingClick(e, { name }){
     this.setState({mesDisplay:'',mapStatus:'',activeItem: name,displayStatusOfDeallocate:'',displayStatus:'none',menuTodayClick:'',menuUpcomingClick:'aliceblue',menuCompletedClick:'',cccontent:(<Grid style={{marginLeft:'6%'}}>
     {this.state.appoinmentDetails.map((item, key) => {
       if(item.Status != 'Completed' && item.PreferredDate != this.state.currentDate){
         return (
           <Card color='purple' onClick={this.openHandle.bind(this,item)}>
             <Label color='orange' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
             <Card.Content>
             <Card.Header>{item.PaName}</Card.Header>
             <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
             <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
             </Card.Content>
           </Card>
         )
        }
       }
     )}
   </Grid>) });
  }
  CompletedClick(e, { name }){
    this.setState({mesDisplay:'none',mapStatus:'none',activeItem: name,displayStatusOfDeallocate:'none',displayStatus:'none',menuTodayClick:'',menuUpcomingClick:'',menuCompletedClick:'aliceblue',cccontent:(<Grid style={{marginLeft:'6%'}}>
    {this.state.appoinmentDetails.map((item, key) => {
      if(item.Status == 'Completed'){
        return (
          <Card color='purple' onClick={this.openHandle.bind(this,item)}>
            <Label color='green' ribbon='left' style={{marginLeft:'5%',width:'30%'}}>Appointment ID: {item.AppointmentID}</Label>
            <Card.Content>
            <Card.Header>{item.PaName}</Card.Header>
            <Card.Description><span style={{float:'left'}}>Date</span><span style={{float:'right'}}>Time</span></Card.Description>
            <Card.Description><span style={{float:'left'}}>{item.PreferredDate}</span><span style={{float:'right'}}>{item.PreferredTime}</span></Card.Description>
            </Card.Content>
          </Card>
        )
       }
      }
    )}
  </Grid>) });
  }
  render()
  {
    const {activeItem} = this.state
    let name = cookies.get('username');
    let role = cookies.get('role');
    let data = this.state.result;
    return (
      <div style={{marginBottom:'10%'}}>
      <h3 style={{color:"orange",paddingBottom:"10px"}}>My Appointments</h3>
        {this.state.modal
          ? <ModalDesign appoinment={this.state.item} closeModal={this.closeModal.bind(this)} cancelCard={this.cancelCard.bind(this)} CheckOutStatus={this.CheckOutStatus.bind(this)} displayStatus={this.state.displayStatus} displayStatusOfDeallocate={this.state.displayStatusOfDeallocate} disableCancel={this.disableCancel.bind(this)} mapStatus={this.state.mapStatus} mesDisplay={this.state.mesDisplay}/>
          : null}
          <Menu attached='top' tabular style={{marginBottom:'11%'}}>
              <Menu.Item name='Today' style={{backgroundColor:this.state.menuTodayClick}} active={activeItem === 'Today'} onClick={this.TodayClick.bind(this)} />
             <Menu.Item name='Upcoming' style={{backgroundColor:this.state.menuUpcomingClick}} active={activeItem === 'Upcoming'} onClick={this.UpcomingClick.bind(this)} />
             <Menu.Item name='Completed' style={{backgroundColor:this.state.menuCompletedClick}} active={activeItem === 'Completed'} onClick={this.CompletedClick.bind(this)} />
           </Menu>
           {this.state.cccontent}
          <ToastContainer ref='asd'
        toastMessageFactory={ToastMessageFactory}
        className='toast-bottom-center'/>
      </div>
    );
  }
}

module.exports = MyAppoinment;
