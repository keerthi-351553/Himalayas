import React from 'react';
import {
 Card,
 Icon,
 Image,
 Grid
} from 'semantic-ui-react';
import StaffModal from './StaffModal';
class MyStaff extends React.Component {

 constructor()
 {
   super();
   this.state={
     phleboList:[],
     modal: false,
     phitem:{}
   }
}

componentWillMount() {
  let context = this;
  let phleboList =[];
  $.ajax({
    url: '/phlebotomist/viewPhlebo',
    type: 'GET',
    async: false,
    success: function(result) {
        result.map((item) => {
          // PhleboID : item.PhleboID
          phleboList.push(item);
          });
          context.setState({phleboList:phleboList});
    }.bind(this)
  });
}
openHandle(item1) {
 this.setState({modal: true,phitem:item1});
}
closeModal() {
 this.setState({modal: false},function(){
 });
}
render()
{
let card = this.state.phleboList.map((item1) =>{
 return(
   <div>
   {this.state.modal
     ? <StaffModal phlebo={this.state.phitem} closeModal={this.closeModal.bind(this)}/>
     : null}
<Card onClick={this.openHandle.bind(this,item1)} style={{margin:"10px"}}>
<Card.Content>
 <Card.Header>
<img className="card-img-circle  img-circle" src={item1.ProfilePhoto} alt="Card image cap" style={{width:'150px',height:"150px",backgroundColor:"orange",marginLeft:'50px'}}/>
 </Card.Header>
 <Card.Description>
   {item1.FirstName} {item1.LastName}
   <br/>
   {item1.ContactNumber}
 </Card.Description>
</Card.Content>
</Card>
</div>
);
})
 return (
   <Grid divided='vertically'>
       <Grid.Column width={2}/>
       <Grid.Column width={12}>
   <Card.Group itemsPerRow={4}>
   {card}
   </Card.Group>
 </Grid.Column>
 </Grid>

 );
}
}
module.exports = MyStaff;
