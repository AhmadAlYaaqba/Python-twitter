import React from 'react';
import $ from 'jquery';
import {Button, Panel, Grid, Col, Row} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      data:[],
      prev: false
    }
    this.changeTweetsPrev = this.changeTweetsPrev.bind(this);
    this.changeTweetsCurn = this.changeTweetsCurn.bind(this);
    this.deleteTweets = this.deleteTweets.bind(this);
    this.reloadTweets = this.reloadTweets.bind(this);
  }

  componentDidMount() {
    var that=this;
    $.ajax({
      type:'GET',
      url: '/tweet',
      success:function(data){
        that.setState({
          data: data
        })
        console.log(data)
      }
    });
  }

  changeTweetsPrev(){
    this.setState({
      prev: true
    })
  }
  
  changeTweetsCurn(){
    this.setState({
      prev: false
    })
  }

  deleteTweets(){
    $.ajax({
      type:'GET',
      url: '/dtweet',
    });
  }

  reloadTweets(){
    $.ajax({
      type:'GET',
      url: '/hello',
    });
    this.setState({
      prev: false
    })
  }

  render(){
    if (this.state.data.length === 0) {
      return (<h1>Loading data... please wait</h1>)
    }
    var show = [];
    if (this.state.prev) {
      show= [];
      for (var i = 0 ; i < 100 ; i++) {
        show.push(this.state.data.customers[i])
      }
    } else {
      show = [];
      for (var i = 100 ; i < this.state.data.customers.length ; i++) {
        show.push(this.state.data.customers[i])
      }
    }
    var arr = [];
    show.forEach(function(tweet, index) {
      arr.push(
        <div key={index}> 
          <Panel bsStyle="primary">
            <Panel.Heading>
              <Panel.Title componentClass="h3">tweeted by: {tweet.user}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>{tweet.text}</Panel.Body>
          </Panel>
          <br />
        </div>
      )
    })
    return(
      <div className='container-fluid'>
      <h1> Last 100 Tweets</h1>
      <Grid>
        <Row>
          <Col md={1} mdPush={1}>
            <Button bsStyle="success" onClick={this.changeTweetsPrev}>Next Tweets</Button>
          </Col>
          <Col md={2} mdPush={2}>
            <Button bsStyle="warning" onClick={this.changeTweetsCurn}>Previous Tweets</Button>
          </Col>
          <Col md={2} mdPush={2}>
            <Button bsStyle="danger" onClick={this.deleteTweets}>Delete</Button>
          </Col>
          <Col md={2} mdPush={2}>
            <Button bsStyle="info" onClick={this.reloadTweets}>Reload</Button>
          </Col>
        </Row>
      </Grid>
      <br />
      <br />
        {arr}
      </div>
    )
  }
}
export default App;