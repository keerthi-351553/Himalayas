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
  Table
} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';

class Component3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      allocationStatus: [],
      column: null,
      direction: null
    }
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount(){
    this.setState({allocationStatus:this.props.phlebo.AllocationStatus});
  }

  handleOpen = () => this.setState({active: true})

  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
  }

  handleSort = clickedColumn => () => {
  const { column, allocationStatus, direction } = this.state

  if (column !== clickedColumn) {
    this.setState({
      column: clickedColumn,
      allocationStatus: _.sortBy(allocationStatus, [clickedColumn]),
      direction: 'ascending',
    })

    return
  }

  this.setState({
    allocationStatus: allocationStatus.reverse(),
    direction: direction === 'ascending' ? 'descending' : 'ascending',
  })
}

  render() {
    const {active} = this.state;
    const { column, direction, allocationStatus } = this.state
    var context = this;
    return (
      <Dimmer active={active} page>
        <Grid>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={10}>
            <Card style={{
              width: '100%'
            }}>
              <Icon name='cancel' style={{float:'left'}} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
              <Label color='orange' ribbon style={{
                marginLeft: '1.5%',
                width:'25%'
              }}>Phlebotomist ID{'  '+this.props.phlebo.PhleboID}</Label>
              <Card.Content>
                <div style={{
                  textAlign: 'left',
                  float: 'left',
                  width:'50%'
                }}>
                <p style={{
                  color: 'orange',
                  fontSize: '18px'
                }}>Phlebotomist details</p>
                <table style={{
                  color: 'black',
                  textAlign:'left',
                  marginLeft:'2%',
                  float:'left'
                }}>
                  <tr>
                    <td style={{color:'teal'}}>Name</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.FirstName} {this.props.phlebo.LastName}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                  <tr>
                    <td style={{color:'teal'}}>Age</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.Age}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                  <tr>
                    <td style={{color:'teal'}}>DOB</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.DateOfBirth}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                  <tr>
                    <td style={{color:'teal'}}>Gender</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.Gender}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                  <tr>
                    <td style={{color:'teal'}}>Address</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.Address}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                  <tr>
                    <td style={{color:'teal'}}>Contact</td>
                    <td style={{width:'35%'}}></td>
                    <td>{this.props.phlebo.ContactNumber}</td>
                  </tr>
                  <tr><td style={{color:'white'}}>1</td></tr>
                </table>
                </div>
                <div style={{
                  float: 'right',
                  textAlign: 'left',
                  width: '40%'
                }}>
                  <img className="card-img-circle  img-circle" src={this.props.phlebo.ProfilePhoto} style={{
                    float: 'left',
                    height:'150px',
                    width:'150px',
                    marginTop:'10%'
                  }}/>
                </div>
                <div style={{
                  float:'left',
                  width:'100%'
                }}>
                  <p style={{
                    color: 'orange',
                    fontSize: '18px',
                    float: 'left'
                  }}>Appointment details</p>
                  <Table striped positive sortable fixed style={{marginBottom:'0%'}}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign='center' sorted={column === 'Date' ? direction : null} onClick={this.handleSort('Date')}>Date</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' >09:00-11:00</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' >11:00-13:00</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' >14:00-16:00</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' >16:00-18:00</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                  </Table>
                  <Scrollbars renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{
                    display: 'none',
                    position: 'right'
                  }}/>} autoHeight autoHeightMax={100}>
                  <Table fixed>
                    <Table.Body>
                      {allocationStatus.map((item, index) => {
                        if(item.Date != ''){
                        return (
                          <Table.Row>
                            <Table.Cell>{item.Date}</Table.Cell>
                            <Table.Cell style={{padding:'10px'}} selectable textAlign='center'>{(item.Slot1.AppointmentID.length == 0)?'--':item.Slot1.AppointmentID}</Table.Cell>
                            <Table.Cell style={{padding:'10px'}} selectable textAlign='center'>{(item.Slot2.AppointmentID.length == 0)?'--':item.Slot2.AppointmentID}</Table.Cell>
                            <Table.Cell style={{padding:'10px'}} selectable textAlign='center'>{(item.Slot3.AppointmentID.length == 0)?'--':item.Slot3.AppointmentID}</Table.Cell>
                            <Table.Cell style={{padding:'10px'}} selectable textAlign='center'>{(item.Slot4.AppointmentID.length == 0)?'--':item.Slot4.AppointmentID}</Table.Cell>
                          </Table.Row>
                        )}
                      })}
                    </Table.Body>
                  </Table>
                </Scrollbars>
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>

        </Grid>

      </Dimmer>
    );
  }
}

module.exports = Component3;
