import React, { Component } from 'react';
import axios from 'axios';

class CurrentReading extends Component{
  constructor(props){
    super(props);

    this.state = {
      readingvalue: 0
    }
  }

  componentDidMount(){
    const targetModifier = this.props.modifier.toLowerCase();
    axios.get(`https://builders-kit-0031.herokuapp.com/api/${targetModifier}`)
      .then(res => {
        this.setState({
          readingvalue: res.data
        });
      });
  }

  render(){
    return(
      <div className="current-reading-value">
        <p>The current {this.props.modifier} reading is {this.state.readingvalue}.</p>
      </div>
    );
  }
}

export default CurrentReading;
