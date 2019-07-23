const React = require('react');
const {hashHistory} = require('react-router');
import {Button, Checkbox, Form, Card,Segment} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var MediaQuery = require('react-responsive');
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const Login = React.createClass({
  getInitialState: function() {
    return {username: '', password: ''};
  },
  handleUserName: function(e) {
    this.setState({username: e.target.value});
  },
  handlePassword: function(e) {
    this.setState({password: e.target.value});
  },
  redirectBasedOnRole: function(res) {
    if (res.Role == "CO") {
      hashHistory.push('/Requests');
    } else if (res.Role == "PH") {
      hashHistory.push('/phleboHome');
    } else if (res.Role == "CC") {
      hashHistory.push('/CallCentreHome');
    } else if (res.Role == "PA") {
      hashHistory.push('/PatientHome');
    } else {
      this.refs.asd.warning(' Invalid Data', '', {
        timeOut: 1000,
        extendedTimeOut: 1000
      });
    }
  },
  LoginUser: function() {
    $.ajax({
      url: "/users/login",
      type: 'POST',
      datatype: 'JSON',
      data: {
        username: this.state.username,
        password: this.state.password,
        loginid: this.state.loginid,
        role: this.state.role
      },
      success: function(res) {
        cookies.set('username', res.Username);
        cookies.set('role', res.Role);
        cookies.set('loginid', res.Loginid);
        cookies.set('emailId', res.EmailId);
        this.redirectBasedOnRole(res);
        // hashHistory.push('/home');
      }.bind(this),
      error: function(err) {
        this.refs.asd.warning(' Invalid Data', '', {
          timeOut: 5000,
          extendedTimeOut: 3000
        });

        setTimeout(5000);
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>

        <center><h1 style={{color:'orange'}}>Max health care</h1></center>
        <div style={{marginTop:'3%'}}>
          <div className="col-xs-2 col-sm-3 col-md-6"></div>
          <div className="col-xs-8 col-sm-7 col-md-5">
            <Segment style={{borderColor:'orange'}}>
              <h4>Login</h4>
              <Form >
                <Form.Input label='Username' placeholder='Enter username' onChange={this.handleUserName}/>
                <Form.Input label='Password' placeholder='Enter password' type="password" onChange={this.handlePassword}/>
                <br/>
                <center>
                <Button color='orange' onClick={this.LoginUser} type="submit" value="Login">Submit</Button></center>
                <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
                  marginTop: '8%',color:'red'
                }}/>
              </Form>
            </Segment>
          </div>
        </div>
</div>

);
}
});

module.exports = Login;
