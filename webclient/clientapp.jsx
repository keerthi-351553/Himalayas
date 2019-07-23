// requiring the needed packages
const React = require('react');
const ReactDOM = require('react-dom');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
const login = require('./components/mainComponents/login.jsx');
const CoordinatorHome = require('./components/Coordinator/CoordinatorHome.jsx');
const ListAppointments = require('./components/Coordinator/ListAppointments.jsx');
const Roster = require('./components/Coordinator/Roster.jsx').default;
const MyStaff = require('./components/Coordinator/MyStaff.jsx');
const CallCentreHome = require('./components/Callcentre/CallCentreHome.jsx');
const phleboHome = require('./components/Phlebotamist/phleboHome.jsx');
const PatientHome = require('./components/patient/patientHome.jsx');
const PatientProfile = require('./components/patient/patientProfile.jsx');
const Feedback = require('./components/patient/Feedback.jsx');
const ChangePassword = require('./components/patient/ChangePassword.jsx');
const MainComp = React.createClass({
  render: function() {
    return (
      <div>
        <CoordinatorHome/>
        {this.props.children}
      </div>
    );
  }
});
ReactDOM.render(
  <Router history={hashHistory}>
  <Route path="/" component={login}/>
  <Route path="/phleboHome" component={phleboHome}/>
  <Route component={MainComp}>
    <Route path="/Requests" component={ListAppointments}/>
    <Route path="/Roster" component={Roster}/>
    <Route path="/MyStaff" component={MyStaff}/>
  </Route>
  <Route path="/CallCentreHome" component={CallCentreHome}/>
  <Route path='/PatientHome' component={PatientHome}/>
  <Route path='/PatientProfile' component={PatientProfile}/>
  <Route path='/Feedback' component={Feedback}/>
  <Route path='/ChangePassword' component={ChangePassword}/>
</Router>, document.getElementById('app'));
