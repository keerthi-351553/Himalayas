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
  Table,
  Button
} from 'semantic-ui-react'
export default class RosterCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Card style={{float:'left',margin:'1% 2%',width:'15%'}}>
        <Label color='orange' ribbon style={{
          marginLeft: '9.5%',
          width:'25%',
          padding:'3%'
        }}>ID{'  '+this.props.appointmentDetails.AppointmentID}</Label>
        <Card.Content>
          <p>{this.props.appointmentDetails.PaName}</p>
          <p>{this.props.appointmentDetails.PaGender+' | '+this.props.appointmentDetails.PaAge}</p>
            <p>{this.props.appointmentDetails.PreferredTime}</p>
        </Card.Content>
      </Card>

    )
  }
}
