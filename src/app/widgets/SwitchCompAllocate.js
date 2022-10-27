import React, { Component } from "react";
import { Switch } from 'antd';
import { Input } from "antd";
 
class SwitchCompAllocate extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.state = { checked1: false };
    this.state = { checked2: false };
    this.state = { checked3: false };
    this.state = { checked4: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);

  }
 
  handleChange(checked) {
    this.setState({ checked });
  }
  handleChange1(checked1) {
    this.setState({ checked1 });
  }
  handleChange2(checked2) {
    this.setState({ checked2 });
  }
  handleChange3(checked3) {
    this.setState({ checked3});
  }
  handleChange4(checked4) {
    this.setState({ checked4 });
  }
  

  toggle=()=>{
    this.setState({
      checked:!this.state.checked
    });
  }
  
  toggle1=()=>{
    this.setState({
      checked1:!this.state.checked1
    });
  }
  
  toggle2=()=>{
    this.setState({
      checked2:!this.state.checked2
    });
  }
  
  toggle3=()=>{
    this.setState({
      checked3:!this.state.checked3
    });
  }
  
  toggle4=()=>{
    this.setState({
      checked4:!this.state.checked4
    });
  }
 
  render() {
    return (
      <>
        <Switch onChange={this.handleChange} checked={this.state.checked} onClick={this.toggle}  checkedChildren="Select" unCheckedChildren="Deselect"/>
         <div className="inputContainer">
                        <label htmlFor="nodeId">Node ID</label>
                        <div className="row"><Switch size="small" onChange={this.handleChange1} checked={this.state.checked1} onClick={this.toggle1}  checkedChildren="ON" unCheckedChildren="OFF"/> Adresse1 </div>
                        <br/>
                        <div className="row"><Switch size="small" onChange={this.handleChange2} checked={this.state.checked2} onClick={this.toggle2} checkedChildren="ON" unCheckedChildren="OFF"/> Adresse2 </div>
                        <br/>
                        <div className="row"><Switch size="small" onChange={this.handleChange3} checked={this.state.checked3} onClick={this.toggle3} checkedChildren="ON" unCheckedChildren="OFF"/> Adresse3 </div>
                        <br/>
                        <div className="row"><Switch size="small" onChange={this.handleChange4} checked={this.state.checked4} onClick={this.toggle4} checkedChildren="ON" unCheckedChildren="OFF"/> Adresse4 </div>
                      </div>
      </>
    );
  }
}
export default SwitchCompAllocate;