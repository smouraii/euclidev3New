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
  Divider,
  message
} from "antd";
import {
  Portlet,
  PortletBody,
  PortletHeader
} from "../../partials/content/Portlet";
import InputComp from "../../widgets/InputComp";
import axios from "axios";
import qs from "qs";

const { Option } = Select;

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log("blur");
}

function onFocus() {
  console.log("focus");
}

class MailServer extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  componentDidMount() {
    const { form } = this.props

    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/sysmail"
    )
    .then((res) => {
      if (res.statusText == "OK") {
        form.setFieldsValue({
          id: res.data.id,
          username: res.data.username,
          MailServer: res.data.host,
          Port: res.data.port,
          SmtpAuth: res.data.smtpAuth ? 'Yes' : 'No',
          SmtpEnable: res.data.smtpStarttls ? 'Yes' : 'No',
          SocketFactortyPort: res.data.smtpSocketFactoryPort,
          SocketFactoryFallbackgit: res.data.smtpSocketFactoryFallback ? 'Yes' : 'No',
          password: res.data.password,
          socketFatoryClass: res.data.smtpSocketFactoryClass,
        })
      }
    })
    .catch((error) => console.log("error", error));
  }

  mailServerSave = (values) => {
    const { form } = this.props

    message.loading({ content: 'Saving mail onfiguration...', key: 'mailSave', duration: 0 });
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/sysmail",qs.stringify({
        id: values.id,
        email: values.username,
        host: values.MailServer,
        port: values.Port,
        smtpAuth: values.SmtpAuth,
        smtpStarttls: values.SmtpEnable,
        smtpSocketFactoryPort: values.SocketFactortyPort,
        smtpSocketFactoryFallback: values.SocketFactoryFallbackgit,
        mailpassword: values.password,
        smtpSocketFactoryClass: values.socketFatoryClass,
      })
    )
    .then((res) => {
      if (res && res.status == '200') {
        form.setFieldsValue({
          id: res.data.sysMailInstance.id
        });
        message.success({ content: 'Mail onfiguration saved', key: 'mailSave', duration: 10 });
      } else {
        message.error({ content: 'A error occur', key: 'mailSave', duration: 10 });
      }
    })
    .catch((error) => {
      console.log("error", error)      
      message.error({ content: 'A error occur', key: 'mailSave', duration: 10 });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.mailServerSave(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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

    return (
      <>
        <InputComp
          title={"MailServer"}
          content={
            <>
              <div className="row d-flex justify-content-center">
                <div className="col-md-12">
                  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Portlet
                      className="kt-portlet--height-fluid kt-portlet--border-bottom-brand"
                      fluidHeight={true}
                    >
                      <PortletBody>
                        <PortletHeader title="Account Information" />

                        {getFieldDecorator("id", {})(<Input style={{display: 'none'}}/>)}

                        <div className="row d-flex justify content-between">
                          <div className="col-md-6">
                            <Form.Item label="Email Adress or Username">
                              {getFieldDecorator("username", {
                                rules: [
                                  {
                                    required: true,
                                    message: "Type here"
                                  }
                                ]
                              })(<Input />)}
                            </Form.Item>
                            <Form.Item label="Outgoing Mail Server (SMTP)">
                              {getFieldDecorator("MailServer", {
                                rules: [
                                  {
                                    required: true,
                                    message: "smtp.XXXX.XXXX"
                                  }
                                ]
                              })(<Input />)}
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <Form.Item label="Password">
                              {getFieldDecorator("password", {
                                rules: [
                                  {
                                    required: true,
                                    message: "Please type your password!"
                                  }
                                ]
                              })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="Port">
                              {getFieldDecorator("Port", {
                                rules: [
                                  {
                                    required: true,
                                    message: "Enter a valid Port"
                                  }
                                ]
                              })(<Input />)}
                            </Form.Item>
                          </div>
                        </div>
                      </PortletBody>
                    </Portlet>
                    <Portlet
                      className="kt-portlet--height-fluid kt-portlet--border-bottom-brand"
                      fluidHeight={true}
                    >
                      <PortletHeader title="SMTP properties" />
                      <PortletBody>
                        <div className="row d-flex justify-content-between">
                          <div className="col-md-6">
                            <Form.Item label="mail.smtp.auth">
                              {getFieldDecorator("SmtpAuth", {
                                rules: [
                                  {
                                    required: true
                                  }
                                ]
                              })(
                                <Select
                                  initialValue="No"
                                  onChange={onChange}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                >
                                  <Option value="Yes">Yes</Option>
                                  <Option value="No">No</Option>
                                </Select>
                              )}
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <Form.Item label="mail.smtp.socketFactory.port">
                              {getFieldDecorator("SocketFactortyPort", {
                                rules: [
                                  {
                                    required: true,
                                    message: "Enter a valid SocketFactory Port"
                                  }
                                ]
                              })(<Input placeholder="465.963" />)}
                            </Form.Item>
                          </div>

                          <div className="col-md-6">
                            <Form.Item label="mail.smtp.socketFactory.fallback">
                              {getFieldDecorator("SocketFactoryFallbackgit", {
                                rules: [
                                  {
                                    required: true
                                  }
                                ]
                              })(
                                <Select
                                  initialValue="No"
                                  onChange={onChange}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                >
                                  <Option value="Yes">Yes</Option>
                                  <Option value="No">No</Option>
                                </Select>
                              )}
                            </Form.Item>
                          </div>

                          <div className="col-md-6">
                            <Form.Item label="mail.smtp.starttls.enable">
                              {getFieldDecorator("SmtpEnable", {
                                rules: [
                                  {
                                    required: true
                                  }
                                ]
                              })(
                                <Select
                                  initialValue="No"
                                  onChange={onChange}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                >
                                  <Option value="Yes">Yes</Option>
                                  <Option value="No">No</Option>
                                </Select>
                              )}
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <Form.Item label="mail.smtp.socketFactory.class">
                              {getFieldDecorator("socketFatoryClass", {
                                rules: [
                                  {
                                    required: true,
                                    message: "java.net.ssl.SSLSocketFactory"
                                  }
                                ]
                              })(
                                <Input placeholder="java.net.ssl.SSLSocketFactory" />
                              )}
                            </Form.Item>
                          </div>
                        </div>
                        <Form.Item {...tailFormItemLayout}>
                          <Button type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Form.Item>
                      </PortletBody>
                    </Portlet>
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

const WrappedMailServer = Form.create({ name: "Inputs" })(MailServer);

export default WrappedMailServer;
