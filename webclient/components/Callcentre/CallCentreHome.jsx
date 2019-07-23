const React = require('react');
const {hashHistory} = require('react-router');
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Image,
  Grid,
  Menu,
  Table
} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import ReactTable from 'react-table';
import PatientModal from './PatientModal';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import _ from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';
class CallCentre extends React.Component {
  constructor()
  {
    super();
    this.state = {
      Patients: [],
      FullData: [],
      activeItem: 'Home',
      modal: false,
      item: {},
      FixAppointment: [],
      FixFlag: 0,
      // Trial : [],
      column: null,
      direction: null,
      UniqueCount: 0,
      NewPatientID: '',
      CurrentDate: '',
      AddressFlag: 0,
      FirstName: '',
      LastName: '',
      Age: 0,
      ContactNumber: '',
      Gender: '',
      Address: '',
      Email: '',
      DateOfBirth: ''
    };
    this.doSearch = this.doSearch.bind(this);
    this.logOut = this.logOut.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.addPatient = this.addPatient.bind(this);
    this.patientAlert = this.patientAlert.bind(this);
    this.emptyFields = this.emptyFields.bind(this);
    this.getLatitudeLongitude = this.getLatitudeLongitude.bind(this);
    this.showResult = this.showResult.bind(this);
  }
  handleItemClick = (e, {name}) => {
    this.setState({activeItem: name});
    if (name === 'Register') {
      this.setState({Patients: this.state.Fulldata})
    }
  }
  componentWillMount() {
    let Patients = [];
    let Trial = [];
    let Count = 0;
    let today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    this.setState({CurrentDate: today});
    $.ajax({
      url: '/patients/viewPatients',
      type: 'GET',
      success: function(data) {
        for (let i in data) {
          Patients.push({
            'PatientID': data[i].PatientID,
            'FirstName': data[i].FirstName,
            'LastName': data[i].LastName,
            'Age': data[i].Age,
            'Gender': data[i].Gender,
            'ContactNumber': data[i].ContactNumber,
            DateOfBirth: data[i].DateOfBirth,
            'Address': data[i].Address,
            'Appointments': data[i].AppointmentRecord,
            'ProfilePhoto':data[i].ProfilePhoto
          });
          Trial.push(data[i].PatientID);
          //  Patients.push("FirstName":result[i].FirstName,"ContactNumber":result[i].ContactNumber,PatientID,"Address":result[i].Address}) ;
        }
        this.setState({Patients: Patients});
        this.setState({Fulldata: Patients});
        for (let i in Trial) {
          Trial[i] = Trial[i].replace('PA', '');
        }
        for (let i in Trial) {
          Trial[i] = parseInt(Trial[i]);
        }
        let Max = Trial[0];
        for (let i in Trial) {
          if (Max < Trial[i]) {
            Max = Trial[i];
          }
        }
        Count = Max + 1;
        this.setState({UniqueCount: Count});
      }.bind(this),
      error: function(err) {
        console.log('error occurred on AJAX');
      }.bind(this)
    });
  }
  logOut() {
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }
  doSearch(e, a) {
    let SearchedContact = a.value;
    let queryResult = [];
    let Fulldata = [];
    let flag = 0;
    if (this.state.Fulldata != '') {
      for (let i in this.state.Fulldata) {
        Fulldata.push(this.state.Fulldata[i]);
      }
    }
    this.setState({Patients: Fulldata});
    if (SearchedContact === "" || SearchedContact === undefined) {
      this.setState({Patients: Fulldata});
    } else {
      for (let i in this.state.Fulldata) {
        if (this.state.Fulldata[i].ContactNumber.includes(SearchedContact)) {
          flag = 1;
          queryResult.push(this.state.Fulldata[i]);
          this.setState({Patients: queryResult});
        }
      }
    }
  }
  openHandle(item) {
    let context = this;
    this.setState({modal: true, item: item});
    // context.setState({item: item});
  }
  closeModal() {
    this.setState({modal: false});
  }
  addPatient(NewPatientID) {
    let context = this;
    let PatientID = NewPatientID;
    let FirstName = this.refs.FName.value.trim();
    let LastName = this.refs.LName.value.trim();
    let Gender = this.refs.Gender.value.trim();
    let DateOfBirth = this.refs.Birth.value;
    let Address = this.refs.Address.value.trim();

    let ContactNumber = this.refs.Phone.value.trim();
    let Email = this.refs.Email.value.trim();
    let Age = this.refs.Age.value.trim();
    let var1 = '';
    let var2 = '';
    let var3 = '';
    var1 = DateOfBirth.substr(0, 4);
    var2 = DateOfBirth.substr(5, 2);
    var3 = DateOfBirth.substr(8, 2);
    let CorrectDate = var3 + '/' + var2 + '/' + var1;
    if (PatientID === '' || FirstName === '' || LastName === '' || Gender === '' || DateOfBirth === '' || Address === '' || Email === '' || Age === '' || ContactNumber === '') {
      context.emptyFields();
    } else {
      context.setState({FirstName: FirstName});
      context.setState({LastName: LastName});
      context.setState({Age: Age});
      context.setState({Gender: Gender});
      context.setState({ContactNumber: ContactNumber});
      context.setState({Email: Email});
      context.setState({Address: Address});
      context.setState({NewPatientID: NewPatientID});
      context.setState({DateOfBirth: CorrectDate});
      context.getLatitudeLongitude(context.showResult, Address);
    }
  }
  handleSort = clickedColumn => () => {
    const {column, Patients, direction} = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        Patients: _.sortBy(Patients, [clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      Patients: Patients.reverse(),
      direction: direction === 'ascending'
        ? 'descending'
        : 'ascending'
    })
  }
  patientAlert() {
let dummy = "this is dummy text"   
 let context = this;
    this.refs.regPatient.success('Patient registered', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  emptyFields() {
    let context = this;
    this.refs.regPatient.error('Empty fields', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  checkForDateAlert() {
    let context = this;
    this.refs.DOB.warning('You cant select a future date for DOB', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  addressAlert() {
    let context = this;
    this.refs.regPatient.error('Enter proper address', '', {
      timeOut: 2000,
      extendedTimeOut: 2000
    });
  }
  showResult(result) {
    let lat = result.geometry.location.lat();
    let lng = result.geometry.location.lng();
    let context = this;
    this.setState({lat: result.geometry.location.lat()});
    this.setState({lng: result.geometry.location.lng()});
    if (lat === '' || lng === '') {
      context.addressAlert();
      context.setState({AddressFlag: 1});
    }
    if (new Date(this.state.DateOfBirth) > new Date()) {
      context.checkForDateAlert();
    } else {
      $.ajax({
        url: '/patients/addPatient',
        type: 'POST',
        data: {
          PatientID: this.state.NewPatientID,
          FirstName: this.state.FirstName,
          LastName: this.state.LastName,
          Gender: this.state.Gender,
          Age: this.state.Age,
          ContactNumber: this.state.ContactNumber,
          DateOfBirth: this.state.DateOfBirth,
          Address: this.state.Address,
          Email: this.state.Email
        },
        success: function(data) {
          context.patientAlert();
          context.setState({activeItem: 'Home'});
          window.location.reload();
        }.bind(this),
        error: function(err) {
          console.log('error occurred on AJAX');
        }.bind(this)
      });
    }
  }
  getLatitudeLongitude(callback, address) {
    let context = this;
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
        } else {
          context.addressAlert();
        }

      });
    }
  }
  render() {
    console.log('data',this.state.item);
    const {activeItem} = this.state;
    const {column, direction} = this.state
    let ActiveMenu = '';
    let FormData = '';
    let name = cookies.get('username');
    let role = cookies.get('role');
    let PData = [];
    let Patients = [];
    let context = this;
    let NewAppointment = '';
    let NewPatientID = 'PA' + this.state.UniqueCount;
    if (this.state.Patients != '') {
      for (let i in this.state.Patients) {
        Patients.push(this.state.Patients[i]);
      }
    }
    Patients.map(function(item, key) {
      PData.push({"PatientID": item.PatientID, "FirstName": item.FirstName, "ContactNumber": item.ContactNumber, "Address": item.Address});
    })
    if (activeItem === 'Home') {
      if (this.state.Patient != '') {
        ActiveMenu = (
          <div>
            <Table style={{
              marginBottom: '0%'
            }} sortable selectable fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'PatientID'
                    ? direction
                    : null} onClick={context.handleSort('PatientID')}>Patient ID</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PName'
                    ? direction
                    : null} onClick={context.handleSort('PName')}>Patient Name</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PContact'
                    ? direction
                    : null} onClick={context.handleSort('PContact')}>Patient Contact</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PAddress'
                    ? direction
                    : null} onClick={context.handleSort('PAddress')}>Patient Address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
              display: 'none',
              position: 'right'
            }}/>} autoHeight autoHeightMax={350}>
              <Table striped selectable fixed>
                <Table.Body>
                  {Patients.map(function(item, key) {
                    return (
                      <Table.Row style={{cursor:"pointer"}} item={item} onClick={context.openHandle.bind(context,item)}>
                        <Table.Cell style={{
                          width: "5%"
                        }}>{item.PatientID}</Table.Cell>
                        <Table.Cell style={{
                          width: "5%"
                        }}>{item.FirstName}&nbsp;{item.LastName}</Table.Cell>
                        <Table.Cell style={{
                          width: "5%"
                        }}>{item.ContactNumber}</Table.Cell>
                        <Table.Cell style={{
                          width: "5%"
                        }}>{item.Address}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Scrollbars>
          </div>
        );
      }

    }

    if (activeItem === 'Register') {
      FormData = (
        <div>
          <h3 style={{
            color: 'orange'
          }}>Add a new patient</h3>
          <Form style={{
            marginLeft: "0%"
          }}>
            <Form.Field>
              <input autoComplete='off' disabled type='text' ref='id' value={NewPatientID} placeholder='Patient ID'/>
            </Form.Field><br/>
            <Form.Field>
              <input autoComplete='off' type='text' ref='FName' placeholder='Enter FirstName'/>
            </Form.Field><br/>
            <Form.Field>
              <input autoComplete='off' type='text' ref='LName' placeholder='Enter LastName'/>
            </Form.Field>
            <Form.Field><br/>
              <input autoComplete='off' type='text' ref='Age' placeholder='Enter Your Age'/>
            </Form.Field>
            <Form.Field><br/>
              <input autoComplete='off' type='text' ref='Gender' placeholder='Enter Gender'/>
            </Form.Field>
            <Form.Field><br/>
              <input autoComplete='off' type='Date' ref='Birth' max={this.state.CurrentDate} placeholder='Date of birth-DD:MM:YYYY'/>
            </Form.Field>
            <Form.Field><br/>
              <input autoComplete='off' type='text' ref='Phone' placeholder='Enter Contact number'/>
            </Form.Field>
            <Form.Field><br/>
              <input autoComplete='off' type='text' ref='Email' placeholder='Enter Email'/>
            </Form.Field>
            <Form.Field><br/>
              <textarea autoComplete='off' type='text' ref='Address' placeholder='Enter Address'/>
            </Form.Field>
          </Form>
          <br/>
          <Button style={{
            marginLeft: "0%"
          }} color='orange' onClick={context.addPatient.bind(context, NewPatientID)}>Register</Button>
        </div>
      )
    }
    return (
      <div>
        {this.state.modal
          ? <PatientModal data={this.state.item} FullData={this.state.Fulldata} closeModal={this.closeModal.bind(this)}/>
          : null}
        <h1 style={{
          marginTop: '1%',
          marginLeft: '11%',
          color: '#4fcfae'
        }}>Max Health Care
        </h1>
        <span style={{
          color: 'orange'
        }}>
          <h3 style={{
            marginLeft: '65%',
            marginTop: '-3%'
          }}>Welcome {name}
            (Customer care)</h3>
          <Button onClick={this.logOut.bind(this)} inverted color="orange" style={{
            marginLeft: '80%'
          }}>
            Logout
          </Button>
        </span>
        <Grid divided='vertically'>
          <Grid.Row>
            <Grid.Column width={2}/>
            <Grid.Column width={12}>
              <Menu pointing secondary stackable>
                <Menu.Item></Menu.Item>
                <Menu.Item name='Home' active={activeItem === 'Home'} onClick={this.handleItemClick} color="orange"/>
                <Menu.Item name='Register' active={activeItem === 'Register'} onClick={this.handleItemClick} color="orange"/>
                <Menu.Item>
                  <Form>
                    <Input transparent placeholder='Search patient' onChange={context.doSearch.bind(context)}/>
                    <Icon style={{
                      float: 'right'
                    }} name='search' color='orange'/>
                  </Form>
                </Menu.Item>
              </Menu>
              {FormData}
              <br/> {ActiveMenu}
              <div>
                {NewAppointment}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ToastContainer ref='regPatient' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
          marginTop: '8%'
        }}/>
        <ToastContainer ref='DOB' toastMessageFactory={ToastMessageFactory} className='toast-top-center' style={{
          marginTop: '8%'
        }}/>
      </div>
    )
  }
}
module.exports = CallCentre;
