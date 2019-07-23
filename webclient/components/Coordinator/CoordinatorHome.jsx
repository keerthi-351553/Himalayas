const React = require('react');
const {browserHistory, hashHistory, Route, Router} = require('react-router');
import {Grid, Menu, Button} from 'semantic-ui-react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Home extends React.Component {

  constructor()
  {
    super();
    this.state = {
      activeItem: ''
    }
  }

  componentWillMount(){
    let loc = window.location.hash.substring(2);
    if(loc == 'Requests'){
      this.setState({activeItem: 'Requests'})
    }
    if(loc == 'Roster'){
      this.setState({activeItem: 'Rostering'})
    }
    if(loc == 'MyStaff'){
      this.setState({activeItem: 'My Staff'})
    }
  }

  handleItemClick(e, {name}){
    this.setState({activeItem: name});
    if(name == 'Requests'){
      hashHistory.push('/Requests');
    }
    if(name == 'Rostering'){
      hashHistory.push('/Roster');
    }
    if(name == 'My Staff'){
      hashHistory.push('/MyStaff');
    }
  }

  logOut() {
    cookies.remove('username');
    cookies.remove('role');
    cookies.remove('loginid');
    cookies.remove('emailId');
    hashHistory.push('/');
  }

  render()
  {
    const {activeItem} = this.state
    let name = cookies.get('username');
    let role = cookies.get('role');
    let data = this.state.result;
    return (
      <div>
        <h1 style={{
          marginTop: '1%',
          marginLeft: '11%',
          color: '#4fcfae'
        }}>Max Health Care
        </h1>
        <span style={{color:'orange'}}>
          <h3 style={{
            marginLeft: '65%',
            marginTop:'-3%',
          }}>Welcome {name}
            (Co-ordinator)</h3>
          <Button onClick={this.logOut.bind(this)} inverted color="orange" style={{
            marginLeft: '81%'
          }}>
            Logout
          </Button>
        </span>
        <Grid divided='vertically'>
          <Grid.Row>
            <Grid.Column width={2}/>
            <Grid.Column width={12}>
              <Menu pointing secondary stackable>
                <Menu.Item name='Requests' active={activeItem === 'Requests'} onClick={this.handleItemClick.bind(this)} color="orange"/>
                <Menu.Item name='Rostering' active={activeItem === 'Rostering'} onClick={this.handleItemClick.bind(this)} color="orange"/>
                <Menu.Item name='My Staff' active={activeItem === 'My Staff'} onClick={this.handleItemClick.bind(this)} color="orange"/>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

module.exports = Home;
