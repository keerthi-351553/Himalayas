const React = require('react');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
import {Button, Modal, Form, Card, Input, Select,Image, Grid, Menu, Icon,Segment, Label,TextArea} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var MediaQuery = require('react-responsive');
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class patientProfile extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  constructor()
  {
    super();
    this.state = {
      FirstName:'',
      LastName:'',
      gender:'',
      age:'',
      address:'',
      contactNumber:'',
      dateOfBirth:'',
      profile:[],
      image:'../../image/default.jpg'
    };
  }
  componentWillMount() {
    var pid = cookies.get('username');
    var arr = [];
    $.ajax({
      url: "/patients/viewAppointment",
      type: 'POST',
      async: false,
      data: {
        pid: pid
      },
      success: function(data) {
        this.setState({profile: data});
        this.setState({FirstName:data[0].FirstName});
        this.setState({LastName:data[0].LastName});
        this.setState({DateOfBirth:data[0].DateOfBirth});
        this.setState({Gender:data[0].Gender});
        this.setState({Address:data[0].Address});
        this.setState({ContactNumber:data[0].ContactNumber});
        this.setState({image:data[0].ProfilePhoto});
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }
  editProfile(){
    var pid = cookies.get('username');
    let data={
        pid:pid,
        FirstName:this.state.FirstName,
        LastName:this.state.LastName,
        Gender:this.state.Gender,
        Address:this.state.Address,
        ContactNumber:this.state.ContactNumber,
        DateOfBirth:this.state.DateOfBirth
      };
      $.ajax({
            url:'/patients/editProfile',
            type: 'POST',
            data:{
                pid:pid,
                FirstName:this.state.FirstName,
                LastName:this.state.LastName,
                Gender:this.state.Gender,
                Address:this.state.Address,
                ContactNumber:this.state.ContactNumber,
                DateOfBirth:this.state.DateOfBirth
              },
            success: function(res)
            {
              this.refs.asd.success(' Upadated successfullyyyyyyyyyy', '', {
                timeOut: 3000,
                extendedTimeOut: 3000
              });
            }.bind(this),
            error: function(err)
            {
              console.log('error occurred on AJAX');
            }.bind(this)
          });
  }

  fnameChange(e) {
    this.setState({FirstName:e.target.value},function() {
    });
  }
  lnameChange(e) {
    this.setState({Lastname:e.target.value});
  }
  genderChange(e) {
    this.setState({Gender:e.target.value});
  }
  addressChange(e) {
    this.setState({Address:e.target.value});
  }
  contactChange(e) {
    this.setState({ContactNumber:e.target.value});
  }
  dobChange(e) {
    this.setState({DateOfBirth:e.target.value});
  }
  logOut(){
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  back(){
    hashHistory.push('/PatientHome');
  }
  pswd(){
    hashHistory.push('/ChangePassword');
  }
  render()
  {
    let name = cookies.get('username');
    let PatientProfile = '';
  if(cookies.get('username')==undefined) {
  hashHistory.push('/')
  location.reload();
  }
  if(cookies.get('username').length!=0) {
    PatientProfile=(
    <div>
      <nav className="navbar navbar-default">
        <div className="col-xs-2 col-sm-3 col-md-3">
          <div><Icon name="arrow circle outline left" style={{cursor:'pointer'}} size="large" color='orange' id="iconPosition" onClick={this.back.bind(this)}/></div>
        </div>

        <div className="col-xs-4 col-sm-5 col-md-5">
              <p style={{marginTop:'1%',marginBottom:'0'}}><b style={{fontWeight:'600',fontSize:'16px'}}>My Profile</b></p>
          <p>{this.state.profile[0].PatientID}</p>
      </div>
      <div className="col-xs-4 col-sm-2 col-md-2" >
        <Button inverted size='small' color='orange' onClick={this.pswd.bind(this)} style={{marginTop:'1%'}}>Change password</Button>
      </div>
        <div className="col-xs-2 col-sm-2 col-md-2" >
        <Icon name="log out" style={{cursor:'pointer'}} id="iconPosition1" size='large' color='orange' onClick={this.logOut.bind(this)}/>
      </div>
    </nav>
      <div className="navbar">

      <div className="col-xs-4 col-sm-5 col-md-5"></div>
        <div className="col-xs-4 col-sm-2 col-md-2">
      <img src={this.state.image} className="img-responsive img-circle profileImage" style={{height:'110px',width:'150px'}}/>
    </div>
    <div className="col-xs-4 col-sm-5 col-md-5">
    </div>
  </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Firstname</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
      <Input type="text" placeholder={this.state.FirstName} onChange={this.fnameChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input>
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Lastname</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
      <Input type="text" placeholder={this.state.LastName} onChange={this.lnameChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input>
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Date of Birth</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
      <Input type="text" placeholder={this.state.DateOfBirth} onChange={this.dobChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input>
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Gender</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
      <Input type="text" placeholder={this.state.Gender} onChange={this.genderChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input>
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Contact No</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
      <Input type="text" placeholder={this.state.ContactNumber} onChange={this.contactChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input>
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>

    <div className='row'>
    <div className="col-xs-1 col-sm-4 col-md-3"></div>
    <div className="col-xs-5 col-sm-2 col-md-3"><p style={{paddingLeft:'20%',paddingTop:'5%'}}>Address</p></div>
    <div><p className="col-xs-5 col-sm-3 col-md-3">
       <TextArea autoHeight placeholder={this.state.Address} rows={2} onChange={this.addressChange.bind(this)} style={{textAlign:'left',width:'94%',padding:'3%',borderColor:'orange',borderRadius:'3px',marginLeft:'3%'}}/>
      {/* <Input type="text" placeholder={this.state.Address} onChange={this.addressChange.bind(this)} style={{textAlign:'left',width:'100%',padding:'3%'}}></Input> */}
      </p></div>
    <div className="col-xs-1 col-sm-3 col-md-3"></div>
    </div>
      <center><Button inverted color='orange' onClick={this.editProfile.bind(this)} style={{marginTop:'2%'}}>save changes</Button>

    </center>
    <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
      marginTop: '8%'
    }}/>
  </div>
);}
    return(

  <div>{PatientProfile}</div>
);
  }
}

module.exports = patientProfile;
