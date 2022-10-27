import React from "react";
import { Modal, Button, Icon } from "antd";
import { Formik, Form } from "formik";


class ModalDelete extends React.Component {
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
        <Icon type="delete" /> Delete an item
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
                  Please select at least one item to perform this action
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
export default ModalDelete;
