import React from 'react';

class HelloWorld extends React.Component {

constructor(props){
  super(props);
  this.state = {message: 'Hello Microsoft Azure, Cloud computing platform!'};
  this.handleClick = this.handleClick.bind(this);
   // This binding is necessary to make `this` work in the callback
   this.handleChange = this.handleChange.bind(this);
}

handleClick(){
  this.setState({message: 'You clicked the button!'});
}

handleChange(event){
  this.setState({message: event.target.value});
}

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <input type="text" onChange={this.handleChange}/>
        <button onClick={this.handleClick}> Click me</button>
      </div>
      
    );
  }
}

export default HelloWorld;
