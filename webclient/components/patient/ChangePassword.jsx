import React from 'react';
const {hashHistory} = require('react-router');
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import {Icon} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class ChangePassword extends React.Component {
  constructor () {
    super();
    this.state={
        Username:'',
        buttonDisable:true,
        buttonColour:false,
        currentPwd:'',
        userEnterCurrentPwd:'',
        newPassword:'',
        cnfrmNewPwd:'',
        btnStatus:true,
        successMsg:false
    }
    this.changePasswordFunc = this.changePasswordFunc.bind(this);
    this.changeUserEnterPwd = this.changeUserEnterPwd.bind(this);
    this.changenewPwd = this.changenewPwd.bind(this);
    this.changecnfrmPwd = this.changecnfrmPwd.bind(this);
  };
  componentWillMount(){
    let a = cookies.get('username');
    let context = this;
      $.ajax({
          url:'/users/viewUser',
          type:'POST',
          data:{Username:a},
          success:function(data){
           context.setState({
                Username: data[0].Username,
               currentPwd: data[0].Password,
               btnStatus: true,
               currPwdCheck: false,
               newPwdcheck: false
           })
           },
           error: function(err){
             console.log("error",err);
}})
}
  changeUserEnterPwd(e){
    this.setState({userEnterCurrentPwd: e.target.value},function(){
    if((this.state.currentPwd == this.state.userEnterCurrentPwd) && (this.state.newPassword == this.state.cnfrmNewPwd) && (this.state.newPassword != "" && this.state.cnfrmNewPwd != "" )){
      this.setState({btnStatus: false});
    }else{
      this.setState({btnStatus: true});
    }

    });
  }
  changenewPwd(e){
    this.setState({newPassword: e.target.value}, function(){
    if((this.state.currentPwd == this.state.userEnterCurrentPwd) && (this.state.newPassword == this.state.cnfrmNewPwd)){
      this.setState({btnStatus: false});
    }else{
      this.setState({btnStatus: true});
    }
    });
    }
  changecnfrmPwd(e){
    this.setState({cnfrmNewPwd: e.target.value},function(){
    if((this.state.currentPwd == this.state.userEnterCurrentPwd) && (this.state.newPassword == this.state.cnfrmNewPwd)){
      this.setState({btnStatus: false});
    }else{
      this.setState({btnStatus: true});
    }
    });
  }
  changePasswordFunc() {
    let context = this;
    let newPassword = this.state.newPassword;
    let Username = this.state.Username;
      $.ajax({
          url:'users/ChangePassword',
          type:'POST',
          data:{Username:Username,newPassword: newPassword},
          success:function(data){

              if(data == 'success'){
                context.setState({userEnterCurrentPwd:'',
                newPassword:'',
                cnfrmNewPwd:'',btnStatus:true, currentPwd:newPassword, successMsg:true})

                this.refs.asd.success(' password changed successfully', '', {
                  timeOut: 3000,
                  extendedTimeOut: 3000
                });
                // setTimeout(this.closeHandleDelete,2000);
              }
            }.bind(this),
              error: function(err){
                console.log("error",err);
              }.bind(this)
            });
  }
  logOut(){
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  back(){
    hashHistory.push('/PatientProfile');
  }
  render() {
    let name = cookies.get('username');
      let changepassword = '';
    let currentPwdMatch;
    let newPwdMatch;
    let crctFormat;
    let successMsgText;
    if(this.state.successMsg){
      successMsgText = (<p className="fontGreen"> password changed successfully </p>);
    }
    if(this.state.userEnterCurrentPwd == ''){
      currentPwdMatch = '';
    } else if((this.state.userEnterCurrentPwd != this.state.currentPwd)){
      currentPwdMatch = '';
    }else{
      currentPwdMatch = '';
    }
    if(this.state.newPassword != this.state.cnfrmNewPwd){
      newPwdMatch = '';
    }else{
      newPwdMatch = '';
      if(this.state.newPassword != '' && this.state.cnfrmNewPwd != '' && this.state.userEnterCurrentPwd === this.state.currentPwd){
              crctFormat = (<p className="fontGreen">Good to go</p>);
      }
    }
    if(cookies.get('username')==undefined) {
    hashHistory.push('/')
    location.reload();
    }
    if(cookies.get('username').length!=0) {
      changepassword=(<div>
      <nav className="navbar navbar-default">
        <div className="col-xs-2 col-sm-3 col-md-3">
          <div><Icon name="arrow circle outline left" style={{cursor:'pointer'}} size="large" color='orange' id="iconPosition" onClick={this.back.bind(this)}/></div>
        </div>

        <div className="col-xs-8 col-sm-7 col-md-7">
              <p style={{marginTop:'1%',marginBottom:'0'}}><b style={{fontWeight:'600',fontSize:'16px'}}>Change password</b></p>
      </div>

        <div className="col-xs-2 col-sm-2 col-md-2" >
          {/* <Button size='small' color='orange' onClick={this.pswd.bind(this)}>Change password</Button> */}
        <Icon name="log out" style={{cursor:'pointer'}} id="iconPosition1" size='large' color='orange' onClick={this.logOut.bind(this)}/>
      </div>

    </nav>
            <div className="container">
                <form>
                  <div className="form-group">
                    <label htmlFor="pwd"> Current Password:</label>
                  <input type="password" required onChange={this.changeUserEnterPwd} value = {this.state.userEnterCurrentPwd} className="form-control" id="pwd" placeholder="Enter current password" name="pwd"/>
                  {currentPwdMatch}
                  </div>
                    <div className="form-group">
                      <label htmlFor="pwd2">New Password:</label>
                      <input type="password" required  onChange={this.changenewPwd} value = {this.state.newPassword}  ref="newPwd" className="form-control" id="pwd2" placeholder="Enter new password" name="pwd2"/>
                    </div>
                      <div className="form-group">
                        <label htmlFor="pwd3">Confirm Password:</label>
                        <input type="password" required  onChange={this.changecnfrmPwd} value = {this.state.cnfrmNewPwd}  ref="cnfrmNewPwd" className="form-control" id="pwd3" placeholder="Enter new password" name="pwd3"/>
                        {newPwdMatch}{crctFormat}
                      </div>
                </form>
                <center>
            <button color='orange'  onClick={this.changePasswordFunc} disabled={this.state.btnStatus} className="btn btn-warning">Change Password</button></center>
            <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
              marginTop: '8%'
            }}/>
              </div>

    </div>);
    }

    return(
      <div>
        {changepassword}
      </div>
      );
    }
  }

module.exports = ChangePassword;
