import React from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import InputComp from "../../widgets/InputComp";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}

class Dbconfiguration extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "86"
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
<>
<InputComp
  title={"DB Configuration"}
content={
  <>

<div className="row d-flex justify-content-center" style={{margin:'50px'}}>
              <div className="col-md-12 ">
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
      <div className="row d-flex justify-content-between">
      <div className="col-md-6">
      <Form.Item label="Driver Class">
          {getFieldDecorator("driverClass", {
            rules:[
              {
                required: true,
              }
            ]
          })(<Select
    showSearch
    placeholder="Select a person"
    optionFilterProp="children"
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    onSearch={onSearch}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="Oracle 10/11">Oracle 10/11</Option>
    <Option value="MySQL">MySQL</Option>
    <Option value="SQLServer">SQLServer</Option>
  </Select>)}
        </Form.Item>
        </div>
        <div className="col-md-6">
        <Form.Item label="Connection name">
          {getFieldDecorator("ConnectionName", {
            rules: [
              {
                required: true,
                message: "Please type a REST Service URL"
              }
            ]
          })(<Input />)} 
        </Form.Item>
        </div>
        </div>
        <div className="row d-flex justify-content-between">
      <div className="col-md-6">
        <Form.Item label="Hostname">
          {getFieldDecorator("hostname", {
            rules: [
              {
                required: true,
                message: "Please type your username!",
              }
            ]
          })(<Input />)}
        </Form.Item>
        </div>
        <div className="col-md-6">
        <Form.Item label="Port" >
          {getFieldDecorator("port", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
           
            ]
          })(<Input />)}
        </Form.Item>
        </div>
        </div>
        <div className="row d-flex justify-content-between">
        <div className="col-md-6">
        <Form.Item label="User" >
          {getFieldDecorator("user", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
           
            ]
          })(<Input />)}
        </Form.Item>
        
        </div>
        <div className="col-md-6">
        <Form.Item label="Password" >
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
           
            ]
          })(<Input.Password />)}
        </Form.Item>
        </div>
        </div>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
      </div>
      </div>
      </>
}
      />
      </>
    );
  }
}

const WrappedDbconfiguration = Form.create({ name: "Inputs" })(Dbconfiguration);

export default WrappedDbconfiguration;
