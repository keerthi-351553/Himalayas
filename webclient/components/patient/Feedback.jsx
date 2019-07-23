const React = require('react');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
import {
  Button,
  Modal,
  Form,
  Card,
  Input,
  Radio,
  Grid,
  Menu,
  Rating,
  Icon
} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var MediaQuery = require('react-responsive');
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class FeedBack extends React.Component {
  state = {
    question1: "",
    resultArray: [],
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    rating: 0
  }

  handleRate = (e, {rating}) => {
    this.setState({rating: rating})
  }
  handleChange = (e, {value}) => {
    this.setState({question1: value})
  }
  handleChange1 = (e, {value}) => {
    this.setState({question2: value})
  }
  handleChange2 = (e, {value}) => {
    this.setState({question3: value})
  }
  handleChange3 = (e, {value}) => {
    this.setState({question4: value})
  }
  handleChange5 = (e, {value}) => {
    this.setState({question5: value})
  }

  constructor()
  {
    super();
  }
  submitFeedback() {
    if (this.state.question1 != "" && this.state.question2 != "" && this.state.question3 != "" && this.state.question4 != "" && this.state.question5 != "" && this.state.rating != "") {
      let context = this;
      var pid = cookies.get('username');
      let aid = window.location.hash.split('&')[0].split('=')[1];
      let phid = window.location.hash.split('&')[1].split('=')[1];
      let date = window.location.hash.split('&')[2].split('=')[1];
      let a = date.split('/');
      a.reverse();
      date = a.join('-');
      $.ajax({
        url: "/phlebotomist/addFeedback",
        type: "POST",
        data: {
          pid: pid,
          date: date,
          aid: aid,
          phid: phid,
          question1: this.state.question1,
          question2: this.state.question2,
          question3: this.state.question3,
          question4: this.state.question4,
          question5: this.state.question5,
          rating: this.state.rating
        },
        success: function(data) {
          this.refs.asd.success(' Feedback submitted', '', {
            timeOut: 3000,
            extendedTimeOut: 3000
          });
          setTimeout(this.pushtohome, 2000);
        }.bind(this),
        error: function(err) {
          console.log('error occurred on AJAX');
        }.bind(this)
      });
    }
  }
  pushtohome() {
    hashHistory.push('/PatientHome');
  }
  logOut() {
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  back() {
    hashHistory.push('/PatientHome');
  }
  render()
  {
    let name = cookies.get('username');
    let feedback = '';
    if (cookies.get('username') == undefined) {
      hashHistory.push('/')
      location.reload();
    }
    if (cookies.get('username').length != 0) {
      feedback = (
        <div>
          <nav className="navbar navbar-default">
            <div className="col-xs-2 col-sm-3 col-md-3">
              <div><Icon name="arrow circle outline left" style={{
          cursor: 'pointer'
        }} size="large" color='orange' id="iconPosition" onClick={this.back.bind(this)}/></div>
            </div>

            <div className="col-xs-4 col-sm-5 col-md-5">
              <p style={{
                marginTop: '1%',
                marginBottom: '0'
              }} id="feedbackPosition">
                <b style={{
                  fontWeight: '600',
                  fontSize: '16px'
                }}>Feedback</b>
              </p>

            </div>
            <div className="col-xs-4 col-sm-2 col-md-2"></div>
            <div className="col-xs-2 col-sm-2 col-md-2">
              <Icon name="log out" style={{
                cursor: 'pointer'
              }} id="iconPosition1" size='large' color='orange' onClick={this.logOut.bind(this)}/>
            </div>

          </nav>
          <Form>

            <Form.Field style={{
              paddingLeft: '10%'
            }}>

              1) Did our phlebotomist reach on time?

            </Form.Field>
            <Form.Field>

              <Radio style={{
                paddingLeft: '10%'
              }} label='Yes' name='radioGroup' value='Yes' checked={this.state.question1 === 'Yes'} onChange={this.handleChange}/>
              <Radio style={{
                paddingLeft: '10%'
              }} label='No' name='radioGroup' value='No' checked={this.state.question1 === 'No'} onChange={this.handleChange}/>

            </Form.Field>
          </Form>
          <Form >
            <Form.Field style={{
              paddingLeft: '10%'
            }}>

              2) Was our phlebotomist warm and friendly?

            </Form.Field>
            <Form.Field>

              <Radio style={{
                paddingLeft: '10%'
              }} label='Yes' name='radioGroup' value='Yes' checked={this.state.question2 === 'Yes'} onChange={this.handleChange1}/>
              <Radio style={{
                paddingLeft: '10%'
              }} label='No' name='radioGroup' value='No' checked={this.state.question2 === 'No'} onChange={this.handleChange1}/>
            </Form.Field>
          </Form>
          <Form >
            <Form.Field style={{
              paddingLeft: '10%'
            }}>

              3) Did our phlebotomist listen carefully to you?

            </Form.Field>
            <Form.Field>

              <Radio style={{
                paddingLeft: '10%'
              }} label='Yes' name='radioGroup' value='Yes' checked={this.state.question3 === 'Yes'} onChange={this.handleChange2}/>
              <Radio style={{
                paddingLeft: '10%'
              }} label='No' name='radioGroup' value='No' checked={this.state.question3 === 'No'} onChange={this.handleChange2}/>
            </Form.Field>
          </Form>
          <Form >
            <Form.Field style={{
              paddingLeft: '10%'
            }}>

              4) Did our phlebotomist answer all your questions to your satisfaction?

            </Form.Field>
            <Form.Field>

              <Radio style={{
                paddingLeft: '10%'
              }} label='Yes' name='radioGroup' value='Yes' checked={this.state.question4 === 'Yes'} onChange={this.handleChange3}/>
              <Radio style={{
                paddingLeft: '10%'
              }} label='No' name='radioGroup' value='No' checked={this.state.question4 === 'No'} onChange={this.handleChange3}/>
            </Form.Field>
          </Form>

          <Form >
            <Form.Field style={{
              paddingLeft: '10%'
            }}>

              5) Would you Like to recommend our Health Care to your family & friends?

            </Form.Field>
            <Form.Field>

              <Radio style={{
                paddingLeft: '10%'
              }} label='Yes' name='radioGroup' value='Yes' checked={this.state.question5 === 'Yes'} onChange={this.handleChange5}/>
              <Radio style={{
                paddingLeft: '10%'
              }} label='No' name='radioGroup' value='No' checked={this.state.question5 === 'No'} onChange={this.handleChange5}/>
            </Form.Field>
          </Form>

          <Form >
            <Form.Field style={{
              paddingLeft: '10%'
            }}>
              6) Overall, I rate Health Care as
              <br></br>
            </Form.Field>
            <Form.Field>
              <Rating style={{
                marginLeft: '15%'
              }} maxRating={5} onRate={this.handleRate}/>
            </Form.Field>
            <Form.Field></Form.Field>
          </Form>
          <br></br>
          <Button onClick={this.submitFeedback.bind(this)} style={{
            marginLeft: '20%',
            color: 'orange'
          }}>Submit</Button>
          <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
            marginTop: '8%'
          }}/>
        </div>
      );
    }

    return (

      <div>
        {feedback}
      </div>

    );
  }
}

module.exports = FeedBack;
