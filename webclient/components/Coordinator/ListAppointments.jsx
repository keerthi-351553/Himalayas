const React = require('react');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
import {Grid, Table, Form, Input, Icon} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import ModalDesign from './ModalDesign';
const cookies = new Cookies();
import _ from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';

class ListAppointments extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      appointmentDetails: [],
      searchResult: [],
      modal: false,
      item: {},
      column: null,
      direction: null
    }
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    let context = this;
    let appointmentDetails = [];
    $.ajax({
      url: '/patients/viewPatients',
      type: 'GET',
      async: false,
      success: function(result) {
        result.map((item1) => {
          item1.AppointmentRecord.map((item) => {
            let x = {
              AppointmentID: item.AppointmentID,
              AssignedPhelbo: item.AssignedPhelbo,
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
              Status: item.Status
            }
            appointmentDetails.push(x);
          })
        })
        context.setState({
          appointmentDetails: appointmentDetails,
          searchResult: appointmentDetails
        });
      }.bind(this)
    });
  }

  handleSort = clickedColumn => () => {
    const {column, searchResult, direction} = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        searchResult: _.sortBy(searchResult, [clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      searchResult: searchResult.reverse(),
      direction: direction === 'ascending'
        ? 'descending'
        : 'ascending'
    })
  }

  openModalDesign(item) {
    this.setState({modal: true, item: item});
  }

  closeModal() {
    this.setState({
      modal: false
    });
  }

  doSearch(e, a) {
    let searchvalue = a.value;
    let searchResult = [];
    let allAppointments = this.state.appointmentDetails;
    if (searchvalue != undefined) {
      for (let i in this.state.appointmentDetails) {
        if (this.state.appointmentDetails[i].AppointmentID.includes(searchvalue)) {
          searchResult.push(this.state.appointmentDetails[i]);
        }
        this.setState({searchResult: searchResult});
      }
    }
  }

  render()
  {
    const {activeItem} = this.state;
    const {column, direction} = this.state
    let name = cookies.get('username');
    let role = cookies.get('role');
    let data = this.state.result;
    return (
      <div>
        {this.state.modal
          ? <ModalDesign allAppointments={this.state.appointmentDetails} appointment={this.state.item} closeModal={this.closeModal.bind(this)}/>
          : null}
        <Grid divided='vertically'>
          <Grid.Column width={2}/>
          <Grid.Column width={12}>
            <Form style={{
              width: '20%',
              border: '1px solid #ececec',
              borderRadius: '3px',
              padding: '.5%'
            }}>
              <Input transparent placeholder='Search appoinment' onChange={this.doSearch.bind(this)}/>
              <Icon style={{
                float: 'right'
              }} name='search' color='orange'/>
            </Form>
            <Table fixed style={{
              marginBottom: '0%'
            }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'AppointmentID'
                    ? direction
                    : null} onClick={this.handleSort('AppointmentID')}>ID</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PaName'
                    ? direction
                    : null} onClick={this.handleSort('PaName')}>Patient Name</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PreferredDate'
                    ? direction
                    : null} onClick={this.handleSort('PreferredDate')}>Service Date</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'PreferredTime'
                    ? direction
                    : null} onClick={this.handleSort('PreferredTime')}>Service Time</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'AssignedPhelbo.Name'
                    ? direction
                    : null} onClick={this.handleSort('AssignedPhelbo.Name')}>Assigned Staff</Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'Test'
                    ? direction
                    : null} onClick={this.handleSort('Test')}>Test</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
              display: 'none',
              position: 'right'
            }}/>} autoHeight autoHeightMax={350}>
              <Table fixed striped selectable sortable>
                <Table.Body>
                  {this.state.searchResult.map((item, key) => {
                    return (
                      <Table.Row onClick={this.openModalDesign.bind(this, item)}>
                        <Table.Cell>{item.AppointmentID}</Table.Cell>
                        <Table.Cell>{item.PaName}</Table.Cell>
                        <Table.Cell>{item.PreferredDate}</Table.Cell>
                        <Table.Cell>{item.PreferredTime}</Table.Cell>
                        {(item.AssignedPhelbo.Name.length == 0)
                          ? <Table.Cell>--</Table.Cell>
                          : <Table.Cell>{item.AssignedPhelbo.Name}</Table.Cell>}
                        <Table.Cell>{item.Test}</Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </Scrollbars>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

module.exports = ListAppointments;
