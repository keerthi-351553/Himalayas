const React = require('react');
import { Card, Icon, Image } from 'semantic-ui-react'
import Cookies from 'universal-cookie';
const {hashHistory} = require('react-router');
// const slider = require('./slideer.jsx');
import MyAccount from './MyAccount.jsx';
import MyAppointment from './MyAppointment.jsx';
import NewRequest from './NewRequest.jsx';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
const cookies = new Cookies();
class PhleboHome extends React.Component {

  constructor()
  {
    super();
    this.state={
      bgcolor:'teal',
      width1:'',
      mleft:'',
      status:'not started',
      ongoingday:'',
      vproperty:'',
      UpcomingApp:'',
      content:'',
      FirstName:'',
      LastName:'',
      ProfilePhoto:''
    }
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.dashboardClick = this.dashboardClick.bind(this);
    this.myAppointmentClick = this.myAppointmentClick.bind(this);
    this.newRequestClick = this.newRequestClick.bind(this);
    this.myAccountClick = this.myAccountClick.bind(this);
    this.digihealthClick = this.digihealthClick.bind(this);
  }
  componentWillMount(){
      let context = this;
      $.ajax({
        url: "/phlebotomist/viewPhlebo",
        type: 'GET',
        async:false,
        success: function(data) {
          data.map((item)=>{
            if(item.PhleboID == cookies.get('loginid')){
                context.setState({FirstName:item.FirstName,LastName:item.LastName,ProfilePhoto:item.ProfilePhoto},function(){
                  context.setState({content:(
                    <div>
                    <Card style={{boxShadow:'none'}}>
                        <Card.Content>
                           <img className="card-img-circle  img-circle profileImage" src={context.state.ProfilePhoto} alt="Card image cap" style={{height:"150px",backgroundColor:"orange",marginLeft:"50px"}}/>
                            <h3 style={{textAlign:'center'}}>Hello {context.state.FirstName} {context.state.LastName}</h3>
                        </Card.Content>
                      </Card>
                    </div>
                  )});
                });
            }
          });
        },
        error: function(err) {
          console.log('error occurred on AJAX');
        }
      });
        }
  checkForStartYourDayAlert() {
      this.setState({activeLoader: false});
      let context = this;
      this.refs.asd.warning(
        'Please click the button to start your day',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
  checkForYourDayStartedAlert() {
      this.setState({activeLoader: false});
      let context = this;
      this.refs.asd.success(
        'Your day has successfully started',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
checkforScheduledSuccessfullyAlert(){
  this.refs.asd.success(
    'The appointment has been scheduled successfully',
    '', {
    timeOut: 2000,
    extendedTimeOut: 2000
  }
  );
}

checkforScheduledSuccessfullyToMyselfAlert(){
  this.refs.asd.success(
    'The appointment has been scheduled successfully to You',
    '', {
    timeOut: 2000,
    extendedTimeOut: 2000
  }
  );
}
  openNav() {
    if(this.state.status == 'started') {
      if(this.state.width1 == '0px') {
        this.setState({width1:'250px',bgcolor:'teal',mleft:'250px'});
      }
      else {
          this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
      }
    }
    else {
      // alert("click the button");
      this.checkForStartYourDayAlert();
    }
  }
  closeNav() {
    this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
  }
  dashboardClick() {
let context =this;
    context.setState({width1:'0px',bgcolor:'teal',mleft:'0px',
    ongoingday:(<button type="button" disabled className="btn btn-success l2" style={{textAlign:'center',verticalAlign:'middle'}}>
       <span>Your day has started</span></button>),
    UpcomingApp:'',
    content:(<div>
    <Card style={{boxShadow:'none'}}>
     <Card.Content>
        <img className="card-img-circle  img-circle profileImage" src={context.state.ProfilePhoto} alt="Card image cap"
        style={{backgroundColor:"orange",marginLeft:"50px"}}/>
        <h3 style={{textAlign:'center'}}>Hello {context.state.FirstName} {context.state.LastName}</h3>
    </Card.Content>
   </Card>
  </div>)
},function(){
});
  }
newRequeststatus(status){
  if(status == true) {
    this.checkforScheduledSuccessfullyAlert();
        this.setState({bgcolor:'teal',
        ongoingday:(<button type="button" disabled className="btn btn-success l2" style={{textAlign:'center',verticalAlign:'middle'}}>
           <span>Your day has started</span></button>),
        UpcomingApp:'',
        content:(<div>
        <Card style={{boxShadow:'none'}}>
         <Card.Content>
            <img className="card-img-circle  img-circle profileImage" src={this.state.ProfilePhoto} alt="Card image cap"
            style={{backgroundColor:"orange",marginLeft:"50px"}}/>
            <h3 style={{textAlign:'center'}}>Hello {this.state.FirstName} {this.state.LastName}</h3>
        </Card.Content>
       </Card>
      </div>)
    },function(){
    });
  }
  else{
    this.checkforScheduledSuccessfullyToMyselfAlert();
        this.setState({bgcolor:'teal',
        ongoingday:'',
        UpcomingApp:'',
        content:(<MyAppointment/>)
    },function(){
    });
  }
}
  myAppointmentClick() {
    this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
    this.setState({ongoingday:'',UpcomingApp:'',content:(<MyAppointment/>)});
  }
  newRequestClick() {
    this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
    this.setState({ongoingday:'',UpcomingApp:'',content:(<NewRequest ProfilePhoto={this.state.ProfilePhoto} newRequeststatus={this.newRequeststatus.bind(this)}/>)});
  }
  myAccountClick() {
    this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
    this.setState({ongoingday:'',UpcomingApp:'',content:(<MyAccount ProfilePhoto={this.state.ProfilePhoto} FirstName={this.state.FirstName} LastName={this.state.LastName}/>)});
  }
  letsClick() {
    this.checkForYourDayStartedAlert();
    this.setState({status:'started',vproperty:'none',ongoingday:(<button type="button" disabled className="btn btn-success l2"
      style={{textAlign:'center',verticalAlign:'middle',display:this.state.vproperty}}>
      <span>Your day has started</span>
    </button>)});
  }
  digihealthClick() {
    // this.setState({width1:'0px',bgcolor:'teal',mleft:'0px'});
      if(this.state.status == 'started') {
        this.setState({width1:'0px',bgcolor:'teal',mleft:'0px',
        ongoingday:(<button type="button" disabled className="btn btn-success l2" style={{textAlign:'center',verticalAlign:'middle'}}>
           <span>Your day has started</span></button>),
        UpcomingApp:'',
        content:(<div>
        <Card style={{boxShadow:'none'}}>
         <Card.Content>
            <img className="card-img-circle  img-circle profileImage" src={this.state.ProfilePhoto} alt="Card image cap"
            style={{backgroundColor:"orange",marginLeft:"50px"}}/>
            <h3 style={{textAlign:'center'}}>Hello {this.state.FirstName} {this.state.LastName}</h3>
        </Card.Content>
       </Card>
      </div>)
    },function(){
    });
    }
    else {
      this.setState({width1:'0px',bgcolor:'teal',mleft:'0px',ongoingday:'',vproperty:'',
      UpcomingApp:'',
      content:(<div>
      <Card style={{boxShadow:'none'}}>
       <Card.Content>
          <img className="card-img-circle  img-circle profileImage" src={context.state.ProfilePhoto} alt="Card image cap"
          style={{backgroundColor:"orange",marginLeft:"50px"}}/>
          <h3 style={{textAlign:'center'}}>Hello {context.state.FirstName} {context.state.LastName}</h3>
      </Card.Content>
     </Card>
    </div>)
  });
    }
  }
  logOut() {
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  render()
  {
    let name = cookies.get('username');
    let role = cookies.get('role');
    let loginid = cookies.get('loginid');
    let emailId = cookies.get('emailId');
    let phlehome = '';
    if(cookies.get('username').length!=0) {
      phlehome = (<div style={{backgroundColor:'teal',height:"40px"}}>
      <div className="phleopage" style={{padding:"0px",marginLeft:"0px",paddingTop:"10px"}}>
      <div id="mySidenav" className="sidenav" style={{width:this.state.width1}}>
        <div className ="imagediv">
        <img src={this.state.ProfilePhoto} style={{marginTop:'-11%',marginLeft:'19%',backgroundColor:'orange',width:'60%',height:'60%'}} alt='avatar' className = "img-responsive img-circle style={{width:70%, height:70px,backgroundColor:'orange'}}"/>
        <h5 style={{color:'white',textAlign:'center'}}>{this.state.FirstName+" "+this.state.LastName}</h5>
        {/* <h5 style={{color:'white',textAlign:'center'}}>{loginid}</h5> */}
        {/* <h5 style={{color:'white',textAlign:'center'}}>{emailId}</h5> */}

      <button className="btn btn-link" onClick={this.dashboardClick} id="b1"><span className="glyphicon glyphicon-home"></span><h5 style={{display:'inline',marginLeft:'21%'}}>Home</h5></button>
      <button className="btn btn-link" id="b1" onClick={this.myAppointmentClick}><span className="glyphicon glyphicon-calendar"></span><h5 style={{display:'inline',marginLeft:'11%'}}>My Appointments</h5></button>
      <button className="btn btn-link" id="b1" onClick={this.newRequestClick}><span className="glyphicon glyphicon-file"></span><h5 style={{display:'inline',marginLeft:'16%'}}>New Request</h5></button>

      <button className="btn btn-link" id="b1" onClick={this.myAccountClick}><span className="glyphicon glyphicon-user"></span><h5 style={{display:'inline',marginLeft:'16%'}}>My Account</h5></button>
      <button className="btn btn-link" id="b1" onClick={this.logOut}>
          <span className="glyphicon glyphicon-log-out"></span><h5 style={{display:'inline',marginLeft:'11%'}}>Logout</h5>
      </button>
        </div>
      </div>

      <div style={{marginLeft:this.state.mleft,backgroundColor:this.state.bgcolor}}>
        <span id="ic" onClick={this.openNav}>&#9776;</span><span id="icname" onClick={this.digihealthClick}>DigiHealth</span>
      </div>
     <div className style ={{paddingLeft: "60px",paddingTop:"30px"}}>
       {this.state.content}
       <div style={{textAlign:"center"}}>
         <button type="button" className="btn btn-warning l1" onClick={this.letsClick.bind(this)}
           style={{textAlign:'center',verticalAlign:'middle',display:this.state.vproperty}}>
           <span> Lets start the day</span>
         </button>

         {this.state.ongoingday}
       </div>
       {this.state.UpcomingApp}

      </div>
      </div>
    </div>
  );
    }
    else {
      hashHistory.push('/');
    }
    return (
      <div>
        {phlehome}
        <ToastContainer ref='asd'
      toastMessageFactory={ToastMessageFactory}
      className='toast-bottom-center'/>
      </div>
    );
  }
}
module.exports = PhleboHome;
