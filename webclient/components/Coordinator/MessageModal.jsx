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
  Form,
  Dropdown,
  TextArea
} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class MessageModal extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true,
      message:''
    }
    this.checkForSendAlert = this.checkForSendAlert.bind(this);
  }

  componentWillMount(){
  }

  handleOpen = () => this.setState({active: true})

  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
  }

  checkForSendAlert(){
    let context = this;
    this.refs.asd.success(
      'Sent successfully',
      '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    }
  );
  setTimeout(context.handleClose, 2000);
  // context.handleClose();
  }

  message(e,a){
    this.setState({message:a.value})
  }

  send(){
    let context = this;
    $.ajax({
      url: '/patients/sendMessage',
      type: 'POST',
      data:{
        pid: context.props.appointment.PaId,
        Message:context.state.message
      },
      success: function(result) {
        context.checkForSendAlert();
      }.bind(this)
    });
  }

  render() {
    const {active} = this.state;
    return (
      <Dimmer active={active} page>
        <Grid>
          <Grid.Column width={6}></Grid.Column>
          <Grid.Column width={4}>
            <Card>
              <Label color='orange' ribbon style={{marginLeft:'5%',width:'50%'}}>{this.props.appointment.PaName}</Label>
              <Icon name='cancel' style={{float:'left'}} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
              <Card.Content>
                <TextArea style={{float:'left',width:'87%',color:'black'}} onChange={this.message.bind(this)} placeholder='Type your message here'/>
                <Icon name='send' size='large' color='orange' style={{float:'right',cursor:'pointer'}} onClick={this.send.bind(this)}/>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        <ToastContainer ref='asd'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-center' style={{marginTop:'8%'}} />
      </Dimmer>
    );
  }
}

module.exports = MessageModal;
