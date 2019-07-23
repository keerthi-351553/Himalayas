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
  Button
} from 'semantic-ui-react';
import RescheduleModal from './RescheduleModal';
import MessageModal from './MessageModal';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
import Map from './Map';
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class Component2 extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true,
      rescheduleModal: false,
      cancelModal: false,
      messageModal: false,
      MapModal: false,
      deassignModal: false
    }
    this.checkForCancelAlert = this.checkForCancelAlert.bind(this);
    this.openMapModal = this.openMapModal.bind(this);
  }

  handleOpen = () => this.setState({active: true})

  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
  }

  closeModal() {
    this.setState({
      rescheduleModal: false,
      cancelModal: false,
      messageModal: false,
      deassignModal: false,
      MapModal: false
    });
  }


  openDeassignModal() {
    this.setState({deassignModal: true});
  }

  openMapModal() {
    this.setState({MapModal: true});
  }

  openRescheduleModal() {
    this.setState({rescheduleModal: true});
  }

  openCancelModal() {
    this.setState({cancelModal: true});
  }

  openMessageModal() {
    this.setState({messageModal: true});
  }

  cancel() {
    let context = this;
    $.ajax({
      url: '/patients/cancelAppointment',
      type: 'POST',
      data: {
        pid: context.props.appointment.PaId,
        aid: context.props.appointment.AppointmentID,
        phid: context.props.appointment.AssignedPhelbo.ID
      },
      success: function(result) {
        context.checkForCancelAlert();
      }.bind(this)
    });
  }

  checkForCancelAlert() {
    let context = this;
    this.refs.asd.success('Cancelled successfully', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
    setTimeout(this.reload,2000);
  }
  reload(){
    location.reload();
  }

  checkForDeassignAlert() {
    let context = this;
    this.refs.asd.success('Deallocated successfully', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
    setTimeout(this.reload,2000);
  }

  deassign() {
    let context = this;
    let data = {
      phleboId: this.props.appointment.AssignedPhelbo.ID,
      appointmentID: this.props.appointment.AppointmentID,
      patientID: this.props.appointment.PaId,
      date: this.props.appointment.PreferredDate
    };
    $.ajax({
      url: '/phlebotomist/cancelPhlebo',
      type: 'POST',
      data: data,
      success: function(res) {
        context.checkForDeassignAlert();
      },
      error: function(err) {
        console.log("Error occured", err);
      }
    });
  }

  render() {
    const {active} = this.state
    let df = this.props.appointment.PreferredDate.split('/');
    df.reverse();
    var context = this;
    let PhleboID = this.props.appointment.AssignedPhelbo.ID;
    return (
      <Dimmer active={active} page>
        {this.state.rescheduleModal
          ? <RescheduleModal allAppointments={this.props.allAppointments} appointment={this.props.appointment} closeModal={this.closeModal.bind(this)}/>
          : null}
        {this.state.messageModal
          ? <MessageModal appointment={this.props.appointment} closeModal={this.closeModal.bind(this)}/>
          : null}
        {this.state.MapModal
          ? <Map PhleboID={PhleboID} PatientAddress={this.props.appointment.PaAddress} closeModal={this.closeModal.bind(this)}/>
          : null}
        <Dimmer active={this.state.cancelModal} onClickOutside={this.closeModal.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <Header icon='remove outline' content='Cancel appointment' style={{
            color: 'white',
            marginLeft: '35%'
          }}/>
          <p style={{
            marginRight: '3.2%'
          }}>Are you sure you want to cancel the appointment?</p>
          <Button color='red' inverted onClick={this.closeModal.bind(this)} style={{
            marginLeft: '10%',
            marginRight: '1%'
          }}>
            <Icon name='remove'/>
            No
          </Button>
          <Button color='green' inverted onClick={this.cancel.bind(this)}>
            <Icon name='checkmark'/>
            Yes
          </Button>
          <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
            marginTop: '8%'
          }}/>
        </Dimmer>
        <Dimmer active={this.state.deassignModal} onClickOutside={this.closeModal.bind(this)} page style={{
          fontSize: '130%'
        }}>
          <Header icon='remove outline' content='Deallocate phlebotomist' style={{
            color: 'white',
            marginLeft: '35%'
          }}/>
          <p style={{
            marginRight: '3.2%'
          }}>Are you sure you want to deallocate the phlebotomist?</p>
          <Button color='red' inverted onClick={this.closeModal.bind(this)} style={{
            marginLeft: '10%',
            marginRight: '1%'
          }}>
            <Icon name='remove'/>
            No
          </Button>
          <Button color='green' inverted onClick={this.deassign.bind(this)}>
            <Icon name='checkmark'/>
            Yes
          </Button>
          <ToastContainer ref='asd' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
            marginTop: '8%'
          }}/>
        </Dimmer>
        <Grid>
          <Grid.Column width={4}></Grid.Column>
          <Grid.Column width={8}>
            <Card style={{
              width: '100%'
            }}>
              <Icon name='cancel' style={{
                float: 'left'
              }} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
              <Label color='orange' ribbon style={{
                marginLeft: '1.5%',
                width: '25%'
              }}>Appointment ID{'  ' + this.props.appointment.AppointmentID}</Label>
              <Card.Content>
                <div>
                  <div style={{
                    textAlign: 'left',
                    float: 'left',
                    marginLeft: '4%'
                  }}>
                    <p style={{
                      color: 'orange',
                      fontSize: '18px'
                    }}>Appointment details</p>
                    <table style={{
                      color: 'black'
                    }}>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'5%'
                        }}>Test</td>
                        <td style={{
                        width: '20%'
                      }}></td>
                        <td>{this.props.appointment.Test}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'5%'
                        }}>Date</td>
                        <td style={{
                        width: '20%'
                      }}></td>
                        <td>{this.props.appointment.PreferredDate}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'5%'
                        }}>Time</td>
                        <td style={{
                        width: '20%'
                      }}></td>
                        <td>{this.props.appointment.PreferredTime}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'5%'
                        }}>Status</td>
                        <td style={{
                        width: '20%'
                      }}></td>
                        <td>{this.props.appointment.Status}</td>
                      </tr>
                    </table>
                  </div>
                  <div style={{
                    float: 'right',
                    textAlign: 'left',
                    width: '50%'
                  }}>
                    <p style={{
                      color: 'orange',
                      fontSize: '18px'
                    }}>Patient details
                      <Icon style={{
                        float: 'right',
                        cursor: 'pointer'
                      }} name='mail' size='large' onClick={this.openMessageModal.bind(this)}/>
                    </p>
                    <table style={{
                      color: 'black'
                    }}>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>Name</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaName}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>ID</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaId}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>Age</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaAge}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>Gender</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaGender}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>Address</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaAddress}</td>
                      </tr>
                      <tr>
                        <td style={{
                          color: 'teal',
                          padding:'2.5%'
                        }}>Contact</td>
                        <td style={{
                        width: '12%'
                      }}></td>
                        <td>{this.props.appointment.PaContact}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                {(this.props.appointment.Status == 'Unassigned' || this.props.appointment.Status == 'Cancelled')
                  ? null
                  : <div style={{
                    width: '100%',
                    float: 'left',
                    marginLeft: '4%',
                    clear: 'both'
                  }}>
                    <p style={{
                      color: 'orange',
                      fontSize: '18px',
                      textAlign: 'left'
                    }}>Phlebo details</p>
                    <img className="card-img-circle  img-circle" src={this.props.appointment.AssignedPhelbo.ProfilePhoto} alt="Card image cap" style={{width:'150px',height:"150px",backgroundColor:"orange",float:'left'}}/>
                      float: 'left'
                    }}/>
                    <div>
                      <table style={{
                        color: 'black',
                        textAlign: 'left',
                        marginLeft: '2%',
                        float: 'left'
                      }}>
                        <tr>
                          <td style={{
                            color: 'teal',
                            padding:'3%'
                          }}>Name</td>
                          <td style={{
                            width: '20%'
                          }}></td>
                          <td>{this.props.appointment.AssignedPhelbo.Name}</td>
                        </tr>
                        <tr>
                          <td style={{
                            color: 'teal',
                            padding:'3%'
                          }}>ID</td>
                          <td style={{
                          width: '20%'
                        }}></td>
                          <td>{this.props.appointment.AssignedPhelbo.ID}</td>
                        </tr>
                        <tr>
                          <td style={{
                            color: 'teal',
                            padding:'3%'
                          }}>Checkin</td>
                          <td style={{
                          width: '20%'
                        }}></td>
                          <td>{this.props.appointment.AssignedPhelbo.CheckIn}</td>
                        </tr>
                        <tr>
                          <td style={{
                            color: 'teal',
                            padding:'3%'
                          }}>Checkout</td>
                          <td style={{
                          width: '20%'
                        }}></td>
                          <td>{this.props.appointment.AssignedPhelbo.CheckOut}</td>
                        </tr>
                      </table>
                      {(new Date(df.join('-')) > new Date() && this.props.appointment.Status != 'Completed')?<Button inverted color='orange' onClick={this.openDeassignModal.bind(this)}>Deallocate</Button>:null}

                    </div>
                    <Image style={{
                      cursor: 'pointer'
                    }} src='../image/maps.png' size='tiny' onClick={this.openMapModal.bind(this)}/>
                  </div>}
                <div></div>
              </Card.Content>
            </Card>
            {(this.props.appointment.Status == 'Unassigned' || this.props.appointment.Status == 'Assigned')
              ? <div>
                  <Button style={{
                    margin: '1%'
                  }} inverted color='orange' onClick={this.openRescheduleModal.bind(this)}>Reschedule</Button>
                  <Button style={{
                    margin: '1%'
                  }} inverted color='orange' onClick={this.openCancelModal.bind(this)}>Cancel Appointment</Button>
                </div>
              : null}
          </Grid.Column>
          <Grid.Column width={4}></Grid.Column>
        </Grid>
      </Dimmer>
    );
  }
}

module.exports = Component2;
