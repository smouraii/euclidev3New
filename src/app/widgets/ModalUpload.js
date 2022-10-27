import React from "react";
import { Modal, Button, Icon, Alert,message, Upload } from "antd";
import { Formik, Form } from "formik";

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class ModalUpload extends React.Component {
  state = {
    loading: false,
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Button type="ghost" onClick={this.showModal}>
        <Icon type="cloud-upload" /> Upload files
        </Button>
        <Modal
          visible={visible}
          title="Upload"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <Formik
            initialValues={{
              Description: "",
              Types: "",
              Products: "",
              Analysis: "",
              Comments: ""
            }}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(false);
            }}
          >
            {({
              values,
              isSubmitting,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleFocus,
              handleSubmit
            }) => (
              <Form>
                <div className="inputContainer">
                  <div
                    className="d-flex justify-content-center"
                    style={{ textAlign: "center" }}
                  >
                    <Alert
                      message="Informational Notes"
                      description="The maximum size allowed for a file is 2 GB.
                      Only files () are allowed."
                      type="info"
                      showIcon
                    />
                  </div>
                  <div className="col-md-12">
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" />
                    </Button>
                  </Upload>
                  </div>
                  {!touched.uploadLogo && !errors.uploadLogo && (
                    <span className="errorContainer">{errors.uploadLogo}</span>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
export default ModalUpload;
