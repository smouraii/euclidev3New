import React from "react";
import {
  Form,
  Input,
  Button,
} from "antd";



class PasswordValidator extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
        <div className="d-flex justify-content-start">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="PasswordOld" hasFeedback>
          {getFieldDecorator("passwordOld", {
            rules: [
              {
                required: true,
                message: "Please input your old password!",
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback placeholder="password">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your new password!",
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
           submit
          </Button>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="default" htmlType="cancel">
            cancel
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedPasswordValidator = Form.create({ name: "register" })(PasswordValidator);
export default WrappedPasswordValidator;

