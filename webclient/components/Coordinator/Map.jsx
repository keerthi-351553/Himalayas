import _ from "lodash";
import React from 'react';
import Helmet from "react-helmet";
import {
  Dimmer
} from 'semantic-ui-react';
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";

export default class GettingStartedExample extends React.Component {

  constructor() {
    super();
    this.state = {
      active: true,
      markers :[],
      lat:0.0,
      lng:0.0
    }
  }

  handleClose = () => {
    this.setState({active: false});
    this.props.closeModal();
  }
  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }
  componentWillMount() {
    let context = this;
    let arr =[];
    let PhleboData = [];
    let PhleboID = this.props.PhleboID;
let position  = [];
let lat = 0.0;
let lang = 0.0;
    $.ajax({
      url: '/phlebotomist/viewPhlebo',
      type: 'GET',
      async: false,
      success: function(result) {
for(let i in result){
  if(result[i] != ''){
    if(result[i].PhleboID === PhleboID){
      //position.push({lat:parseFloat(result[i].Location.Latitude),lng:parseFloat(result[i].Location.Longitude)});
lat = parseFloat(result[i].Location.Latitude);
lang = parseFloat(result[i].Location.Longitude);
    }
  }
}
context.setState({lat:lat});
context.setState({lng:lang});

      }.bind(this)
    });

  }


  render() {
    const GettingStartedGoogleMap = withGoogleMap(props => (
      <GoogleMap ref={props.onMapLoad} defaultZoom={16} defaultCenter={{
        lat: this.state.lat,
        lng: this.state.lng
      }} onClick={props.onMapClick}>
        {props.markers.map(marker => (<Marker {...marker}/>))}
      </GoogleMap>
    ));
let lat = this.state.lat;
let lng = this.state.lng;
    let markers =  [{
      position: {
        lat: lat,
        lng: lng,
      }
    }]

    const {active} = this.state;
//let data = this.state.markers
    return (<Dimmer active={active} onClickOutside={this.handleClose} page>
      <div style={{
        height: `500px`
      }}>
        <Helmet title="Max Health Centre"/>
        <GettingStartedGoogleMap
        containerElement={< div style = {{ height: `100%` }}/>}
        mapElement={< div style = {{ height: `100%` }}/>}
        onMapLoad={this.handleMapLoad}
        markers={markers}/>
      </div>
      </Dimmer>

    );
  }
}
