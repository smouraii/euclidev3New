import React, { Component } from "react";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;

export default class SelectQuery extends Component {
  state = {
    value: null,
    selectedValuesData: [],
  };

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_HOST}/EuclideV2/api/getSelectOptions?dc=${this.props.customProps.package}.${this.props.customProps.domain}&display=${this.props.customProps.displayValue}`,
        { withCredentials: true}
      )
      .then((res) => {
        this.setState(
          { selectedValuesData: res.data.results },
          console.log("SelecOptions", this.state.selectedValuesData)
        );
      });
    console.log("ComponentDidMount");
  }

  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange(value)
  };

  render() {
    const options = this.state.selectedValuesData.map((d) => (
      <Option key={d.id}>{d.name}</Option>
    ));
    return (
      <Select
        placeholder={this.props.placeholder}
        size="small"
        style={{ width: 150 }}
        onChange={this.handleChange}
      >
        {options}
      </Select>
    );
  }
}
