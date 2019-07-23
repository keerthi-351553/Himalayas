/* global google */
import _ from "lodash";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import React from 'react';

import Helmet from "react-helmet";
// import Geocoder from 'react-native-geocoding';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import {
  Icon,
  Button,
  Card,
  Dimmer,
  Header,
  Form,
  Radio
} from 'semantic-ui-react';

class PatientMap extends React.Component {

  state = {active:true,
    markers: [{
      position: {
        lat: 12.8537,
        lng: 77.6625,
      },
      key: `Bangalore,Electronic City`,
      defaultAnimation: 2,
    }],
  };

  handleMapLoad = this.handleMapLoad.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }
  handleClose = () => {
      this.setState({active: false});
      this.props.closeActive3();

    }
  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  // closeHandleView = () => this.setState({activate1:false})
closeHandleView(){
location.reload();
}


  render() {
    const GettingStartedGoogleMap = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}

        defaultCenter={{ lat: 12.8537, lng: 77.6625 }}
        defaultZoom={14}
        onClick={props.onMapClick}
      >
        {props.markers.map(marker => (
          <Marker
            {...marker}
            onRightClick={() => props.onMarkerRightClick(marker)}
          />
        ))}
      </GoogleMap>
    ));
    let name = cookies.get('username');
    let map='';

const {active} = this.state;
if(cookies.get('username').length!=0) {
  map=( <Dimmer active ={active} page  onClickOutside={this.handleClose}>

  <div style={{height: '70%',width:'90%',marginLeft:'5%'}}>
    <Icon name='cancel' style={{
      float: 'left'
    }} onClick={this.handleClose.bind(this)} style={{float:'right',color:'orange',cursor:'pointer'}}/>
    <p>Location of the phlebotomist</p>
    <Icon name='cancel' style={{
      float: 'left'
    }} onClick={this.handleClose.bind(this)} id='closeIconPosition'/>
    <Helmet
      title="Max Health Care"
    />
    <GettingStartedGoogleMap
      containerElement={
        <div style={{ height: `80%` }} />
      }
      mapElement={
        <div style={{ height: `100%` }} />
      }
      onMapLoad={this.handleMapLoad}
      markers={this.state.markers}
    />
  </div>
</Dimmer>

);}
if(cookies.get('username')==undefined) {
hashHistory.push('/')
location.reload();
}
    return (
      <div>
        {map}
      </div>
    );

  }
}
module.exports = PatientMap;
