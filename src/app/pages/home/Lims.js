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
  message
} from "antd";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import InputComp from "../../widgets/InputComp";
import axios from "axios";
import qs from "qs";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class Lims extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  componentDidMount() {
    const { form } = this.props

    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/syslims",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    )
    .then((res) => {
      console.log("reponse",res)
      form.setFieldsValue({
        id: res.data.id,
        limsDatabase: res.data.l_restdatabaseId,
        password: res.data.l_restpassword,
        restServiceUrl: res.data.l_restUrl,
        username: res.data.l_restuser,
        nodeId: res.data.l_restNodeId,
      })
    })
    .catch((error) => console.log("error", error));
  }

  limsSave = (values, configImport) => {
    const { form } = this.props

    message.loading({ content: 'Testing connection', key: 'limsSave', duration: 0 });

    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/syslims/checkConnection",
      {
        params: {
          restdatabaseId: values.limsDatabase,
          restpassword: values.password,
          restUrl: values.restServiceUrl,
          restuser: values.username,
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    )
    .then((res) => {

      if (!res.data.success) {
        message.error({ content: 'Connection invalide', key: 'limsSave', duration: 10 });
        return;
      }
      
      if (configImport) {
        message.loading({ content: 'Import config', key: 'limsSave', duration: 0 });
      } else {
        message.success({ content: 'Connection valide', key: 'limsSave', duration: 0 });
      }

      return axios.post(
        process.env.REACT_APP_HOST + "/EuclideV2/api/admin/syslims",qs.stringify({
          id: values.id,
          restdatabaseId: values.limsDatabase,
          restpassword: values.password,
          restUrl: values.restServiceUrl,
          restuser: values.username,
          nodeid: values.nodeId,
          startCddc: configImport ? 'on' : null
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      );
    })
    .then((res) => {
      if (res && res.status == '200') {
        form.setFieldsValue({
          id: res.data.sysLimsInstance.id
        });
        message.success(configImport ? { content: 'Import finished', key: 'limsSave', duration: 10 } : { content: 'Connection saved', key: 'limsSave', duration: 10 });
      }
    })
    .catch((error) => {
      console.log("error", error);
      message.error({ content: 'A error occur', key: 'limsSave', duration: 10 });
    });
  }

  handleOnClick = (configImport) => {
    console.log(configImport);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.limsSave(values, configImport);
        console.log("Received values of form: ", values);
      }
    });
  }

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
          title={"Lims"}
          content={
            <>
              <div
                className="row d-flex justify-content-center"
                style={{ marginTop: "50px" }}
              >
                <div className="col-md-6 ">
                  <Form {...formItemLayout}>
                    
                    {getFieldDecorator("id", {})(<Input style={{display: 'none'}}/>)}

                    <Form.Item label="Rest Services URL">
                      {getFieldDecorator("restServiceUrl", {
                        rules: [
                          {
                            required: true,
                            message: "Please type a REST Service URL"
                          }
                        ]
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Lims Database">
                      {getFieldDecorator("limsDatabase", {
                        rules: [
                          {
                            required: true,
                            message: "Please type a LIMS DATABASE"
                          }
                        ]
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Username">
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Please type your username!"
                          }
                        ]
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your password!"
                          }
                        ]
                      })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Node ID">
                      {getFieldDecorator("nodeId", {
                        rules: [
                          {
                            required: true,
                            message: "Please input the nodeId!"
                          }
                        ]
                      })(<Input />)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                      <Button type="default" onClick={e => this.handleOnClick(false)}>
                        Check connection
                      </Button> <Button type="primary" onClick={e => this.handleOnClick(true)}>
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

const WrappedLims = Form.create({ name: "Inputs" })(Lims);

export default WrappedLims;
