const React = require('react');
import{Form, Input,TextArea ,Card,Button} from 'semantic-ui-react';
const {hashHistory} = require('react-router');
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class MyAccount extends React.Component {
  constructor()
  {
    super();
    this.state = {
    firstName:'',
    lastName:'',
    age:'',
    dateOfBirth:'',
    gender:'',
    address:'',
    address1:'',
    contactNumber:'',
    contactNumber1:'',
    newPassword:'',
    newPassword1:'',
    confirmPassword:'',
    profilePhoto:'',
    newPassword2:'',
    confirmPassword2:'',
    contactNumber2:'',
    address2:'',
    };
  }
  checkForEditProfileSuccessfullyAlert() {
      let context = this;
      this.refs.asd.success(
        'Profile updated successfully',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
  checkForErrorProfileAlert() {
      let context = this;
      this.refs.asd.warning(
        'Password and confirm password should be same',
        '', {
        timeOut: 2000,
        extendedTimeOut: 2000
      }
    );
  }
checkforEmptyFields(){
  this.refs.asd.error(
    'Empty fields',
    '', {
    timeOut: 2000,
    extendedTimeOut: 2000
  }
);
}
checkfornumberAlert(){
  this.refs.asd.warning(
    'Please enter proper contact number',
    '', {
    timeOut: 2000,
    extendedTimeOut: 2000
  }
  );
}
  ContactNumberChange(e){
    if(e.target.value.length == 0){
      this.setState({contactNumber2:e.target.value,contactNumber:contactNumber1},function(){
      });
    }
    else{
      this.setState({contactNumber2:e.target.value,contactNumber:e.target.value},function(){
      });
    }
  }
  NewPasswordChange(e){
    this.setState({newPassword2:e.target.value,newPassword:e.target.value},function(){
    });
  }
  ConfirmPasswordChange(e){
    this.setState({confirmPassword2:e.target.value,confirmPassword:e.target.value},function(){
    });
  }
  addressChange(e){
    if(e.target.value.length == 0){
      this.setState({address2:e.target.value,address:address1},function(){
      });
    }
    else{
      this.setState({address2:e.target.value,address:e.target.value},function(){
      });
    }

  }
  componentWillMount(){
    var PhleboID =cookies.get('loginid')
    $.ajax({
      url:'/phlebotomist/viewPhleboWithId',
      type:'POST',
      asyn:false,
      data:{
        PhleboID:PhleboID
      },
      success:function(data){
        this.setState({firstName:data[0].FirstName});
        this.setState({lastName:data[0].LastName});
        this.setState({age:data[0].Age});
        this.setState({dateOfBirth:data[0].DateOfBirth});
      this.setState({gender:data[0].Gender});
      this.setState({address:data[0].Address});
      this.setState({address1:data[0].Address});
      this.setState({contactNumber:data[0].ContactNumber});
      this.setState({contactNumber1:data[0].ContactNumber});
      this.setState({profilePhoto:data[0].ProfilePhoto});
    }.bind(this),
    error:function(err){
      console.log('error occured on ajax');
    }.bind(this)
  });
  $.ajax({
    url:'/users/userPasswordChange',
    type:'POST',
    asyn:false,
    data:{
      Loginid:PhleboID
    },
    success:function(data){
      this.setState({newPassword1:data[0].Password});
      this.setState({newPassword:data[0].Password});
      this.setState({confirmPassword:data[0].Password});
    }.bind(this),
    error:function(err){
      console.log("err");
    }.bind(this)
  });
  }



   editPhlebo(){
     let context = this;
    var PhleboID = cookies.get('loginid');

    if(this.state.newPassword2.length == 0 && this.state.confirmPassword2.length == 0 && this.state.contactNumber2.length == 0 && this.state.address2.length == 0) {
      context.checkforEmptyFields();
    }
    else if((this.state.newPassword==this.state.confirmPassword && this.state.contactNumber.length==10)){
    if(this.state.newPassword.length == 0){
      this.setState({newPassword:this.state.newPassword1});
    }
    $.ajax({
          url:'/phlebotomist/editPhlebo',
          type: 'POST',
          data:{
            PhleboID:PhleboID,
            Password:this.state.confirmPassword,
            ContactNumber:this.state.contactNumber,
            Address:this.state.address
},
          success: function(res)
          {
            context.checkForEditProfileSuccessfullyAlert();

          }.bind(this),
          error: function(err)
          {
            console.log('error occurred on AJAX');
          }.bind(this)
        });
      }
      else if(this.state.newPassword!=this.state.confirmPassword){
        context.checkForErrorProfileAlert();
      }
      else if(this.state.contactNumber.length!=10){
        context.checkfornumberAlert();
      }
  }

  render()
  {

    return(
    <div style={{marginBottom:'10%'}}>
    <Card style={{boxShadow:'none'}}>
        <Card.Content>
           <img className="card-img-circle  img-circle" src={this.props.ProfilePhoto} alt="Card image cap" style={{height:"150px",backgroundColor:"orange",marginLeft:"50px"}}/>
        </Card.Content>
      </Card>
      <p style={{textAlign:'center',fontWeight:'bold'}}>{this.props.FirstName+" "+this.props.LastName}</p>
    <Form>

    <Form.Field >
      <label> New Password</label>
      <Input type='password' placeholder='Enter New Password' onChange={this.NewPasswordChange.bind(this)} />
    </Form.Field>
    <br/>

    <Form.Field >
      <label> Confirm Password</label>
      <Input type='password' placeholder='Renter New Password' onChange={this.ConfirmPasswordChange.bind(this)}/>
    </Form.Field>
    <br/>
    <Form.Field >
      <label>Contact Number</label>
      <Input type='number' placeholder={this.state.contactNumber}onChange={this.ContactNumberChange.bind(this)}/>
    </Form.Field>
    <br/>
    <Form.Field >
      <label>Address</label>
    <TextArea style={{borderColor:'orange'}} autoHeight placeholder={this.state.address} rows={2} onChange ={this.addressChange.bind(this)} />
  </Form.Field>

  </Form>
  <br/>
  <Button color='teal' name="submit" type="submit"
  style={{marginLeft:'65px',marginTop:'10px'}}toggle  onClick={this.editPhlebo.bind(this)}>
      Update Profile
       </Button>
       <ToastContainer ref='asd'
     toastMessageFactory={ToastMessageFactory}
     className='toast-bottom-center'/>
    </div>
    );
  }
}
module.exports = MyAccount;
