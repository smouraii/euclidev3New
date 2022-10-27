import React, { useState, useEffect } from "react";
import { Table, Icon, Tag, Tooltip, Typography, Button, Popconfirm, Popover, Modal, Select, Input, message } from "antd";
import FInput from "../../widgets/inputs/FInput";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useField, useFormikContext } from "formik";
import qs from "qs";
import * as Yup from 'yup';
import { Portlet, PortletBody } from "../../partials/content/Portlet";

const { Text, Paragraph } = Typography;

const ModalAddUser = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  const userSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required'),
    surname: Yup.string()
      .required('Required'),
    username: Yup.string()
      .required('Required')
      .test('checkUsernameUnique', 'This username is already registered.', value =>
        axios.get(
          process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/usercheck",
          {
            params: {
              username: value
            }
          }
        )
        .then(res => {
          return res.data.status === 'OK'
        }),
      ),
    email: Yup.string()
      .email('Invalid email')
      .required('Required')
      .test('checkEmailUnique', 'This email is already registered.', value =>
        axios.get(
          process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/usercheck",
          {
            params: {
              email: value
            }
          }
        )
        .then(res => {
          return res.data.status === 'OK'
        }),
      ),
  });
  
  const UsernameField = (props) => {
    const {
      values: { name, surname },
      touched,
      setFieldValue,
    } = useFormikContext();
    const [field, meta] = useField(props);
  
    React.useEffect(() => {
      if (
        name.trim() !== '' &&
        surname.trim() !== '' &&
        touched.name &&
        touched.surname
      ) {
        setFieldValue(props.name, `${name.toLowerCase().slice(0,1)}${surname.toLowerCase().replace(/ /g,'')}`);
      }
    }, [name, surname, touched.name, touched.surname, setFieldValue, props.name]);
  
    return (
      <FInput {...props} {...field} />
    );
  };

  const getAddresses = () => {
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/addresses"
    )
    .then((res) => {
      if (res.statusText === "OK") {
        setAddresses(res.data);
      }
    })
    .catch((error) => console.log("error", error));
  }

  const selectAddress = (id) => {
    const selected = addresses.find(e => e.id === id);

    if (selected) {
      setSelectedAddresses([
        ...selectedAddresses,
        selected
      ])
    }
  }

  const deselectAddress = (id) => {
    const deselected = addresses.find(e => e.id === id)

    if (deselected) {
      setSelectedAddresses(selectedAddresses.filter(e => e.id !== deselected.id));
    }
  }

  const clearSelectedAddresses = () => setSelectedAddresses([])

  return (
    <div>
      <Tooltip title='Add user'>
        <Button size="large" type="default" onClick={() => setModalVisible(true)}>
          <Icon type="user-add" />
        </Button>
      </Tooltip>
      <Formik
          initialValues={{
            name: '',
            surname: '',
            username: '',
            email: ''
          }}
          onSubmit={(data, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            axios.post(
              process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user",qs.stringify({
                name:data.name,
                surname:data.surname,
                username:data.username,
                email:data.email,
                // select_all:data.select_all,
                adress_selected:JSON.stringify(selectedAddresses.map((address) => address.id))
              })
            )
            .then((res) => {
              setSubmitting(false);
              if (res.data.message === 'success') {
                setModalVisible(false);
                resetForm();
                clearSelectedAddresses();
                message.success({ content: 'User created', key: 'userSave', duration: 10 });
              } else {
                message.error({ content: 'A error occur', key: 'userSave', duration: 10 });
              }
            })
            .catch((error) => {
              setSubmitting(false);
              message.error({ content: 'A error occur', key: 'userSave', duration: 10 });
              console.log("error", error)
            });
          }}
          validationSchema={userSchema}
        >
          {({
            values,
            isSubmitting,
            status,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <Form>
              <Modal
                visible={modalVisible}
                title="Add a User"
                onCancel={() => {
                  resetForm();
                  clearSelectedAddresses();
                  setModalVisible(false);
                }}
                footer={[
                  <Button key="back" onClick={() => {
                    resetForm();
                    clearSelectedAddresses();
                    setModalVisible(false);
                  }}>
                    Return
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                ]}
              >

                <FInput
                  key="name"
                  name="name"
                  label="Name"
                />
                <FInput
                  key="surname"
                  name="surname"
                  label="Surname"
                />
                <UsernameField
                  key="username"
                  name="username"
                  label="Username"
                />
                <FInput
                  key="email"
                  name="email"
                  label="Email"
                />
                <div className="inputContainer">
                  <label htmlFor="addresses">Addresses</label>
                  <Field
                    component={Select}
                    name="addresses"
                    style={{ width: "100%" }}
                    mode="multiple"
                    onDropdownVisibleChange={(open) => open ? getAddresses() : null}
                    onSelect={selectAddress}
                    onDeselect={deselectAddress}
                    filterOption={true}
                    optionFilterProp={'content'}
                    value={selectedAddresses.map(elem => elem.id)}
                  >
                    {addresses.map((elem) => (
                      <Select.Option key={elem.id} value={elem.id} content={elem.addressid} >
                        {elem.addressid}
                      </Select.Option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="addresses"
                    render={(msg) => <Typography.Text type="danger">{msg}</Typography.Text>}
                  />
                </div>
              </Modal>
            </Form>
        )}
      </Formik>
    </div>
  );
}

function UserRole(props) {
  const [hover, setHover] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const { role, record, actionCallback } = props;

  useEffect(() => {
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/roles"
    )
    .then((res) => {
      if (res.statusText === "OK") {
        setRoles(res.data);
      }
    })
    .catch((error) => console.log("error", error));
  }, [])

  useEffect(() => {
    const selected = roles.find(e => e.role === role);
    if (selected) {
      selectRole(selected.id)
    }
  }, [roles, role])

  const selectRole = (id) => {
    const selected = roles.find(e => e.id === id);

    if (selected) {
      setSelectedRole(selected);
    }
  }

  const deselectRole = (id) => {
    setSelectedRole(null)
  }

  return (
    <>
      <Tooltip title='Change role'>
        <Button 
          onClick={() => setModalVisible(true)}  
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          icon={hover ? "edit" : "team"}
        >{role}</Button></Tooltip>
          <Formik
            initialValues={{
              role: "",
            }}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              axios.post(
                process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/role",qs.stringify({
                  userRow: record.id,
                  newRole:selectedRole.id,
                })
              )
              .then((res) => {
                setSubmitting(false);
                if (res.data.success) {
                  setModalVisible(false);
                  resetForm();
                  actionCallback();
                  message.success({ content: 'User role updated', key: 'userRole', duration: 10 });
                } else {
                  message.error({ content: 'A error occur', key: 'userRole', duration: 10 });
                }
              })
              .catch((error) => {
                setSubmitting(false);
                message.error({ content: 'A error occur', key: 'userRole', duration: 10 });
                console.log("error", error)
              });
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
                <Modal
                  visible={modalVisible}
                  title="Change Role"
                  onCancel={() => setModalVisible(false)}
                  footer={[
                    <Button key="back" onClick={() => setModalVisible(false)}>
                      Return
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      loading={false}
                      onClick={() => handleSubmit()}
                    >
                      Submit
                    </Button>
                  ]}>
                <div className="inputContainer">
                  <div className="inputContainer">
                    <Field
                      component={Select}
                      name="role"
                      style={{ width: "100%" }}
                      onSelect={selectRole}
                      onDeselect={deselectRole}
                      filterOption={true}
                      optionFilterProp={'content'}
                      value={selectedRole && selectedRole.id}
                    >
                      {roles.map((elem) => (
                        <Select.Option key={elem.id} value={elem.id} content={elem.role} >
                          {elem.role}
                        </Select.Option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="role"
                      render={(msg) => <Typography.Text type="danger">{msg}</Typography.Text>}
                    />
                  </div>
                </div>
                </Modal>
              </Form>
            )}
          </Formik>
    </>
  )
}

function UserClientLims(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const { clientLims, record, actionCallback } = props;
  
  useEffect(() => {
    setAddresses(clientLims);
  }, [clientLims])

  useEffect(() => {
    if (clientLims) {
      setSelectedAddresses(clientLims)
    }
  }, [clientLims])

  const getAddresses = () => {
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/addresses"
    )
    .then((res) => {
      if (res.statusText === "OK") {
        setAddresses(res.data);
      }
    })
    .catch((error) => console.log("error", error));
  }

  const selectAddress = (id) => {
    const selected = addresses.find(e => e.id === id);

    if (selected) {
      setSelectedAddresses([
        ...selectedAddresses,
        selected
      ]);
    }
  }

  const deselectAddress = (id) => {
    const deselected = addresses.find(e => e.id === id)

    if (deselected) {
      setSelectedAddresses(selectedAddresses.filter(e => e.id !== deselected.id))
    }
  }

  return (
    <>
      <Popover
        title={<Text><Icon type="environment"/> Allocated Addresses</Text>}
        content={(
          <>
            { clientLims.length > 0 && <Paragraph>
            {
              clientLims.map(client => (
                <Text style={{textAlign: 'center'}} key={client.id}>{client.addressid} <br /></Text>
              ))
            }
            </Paragraph>}
            <Button size="small" type="dashed" icon="plus" onClick={() => setModalVisible(true)}>Allocate Addresses</Button>
          </>
        )}
      >
        <Icon type="unordered-list" />
      </Popover>
      <Formik
        initialValues={{
          Description: "",
          Types: "",
          Products: "",
          Analysis: "",
          Comments: ""
        }}
        onSubmit={(data, { setSubmitting, resetForm }) => {setSubmitting(true);
          axios.post(
            process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/addresses",qs.stringify({
              user: record.id,
              selected_add: JSON.stringify(selectedAddresses.map((address) => address.id)),
            })
          )
          .then((res) => {
            setSubmitting(false);
            if (res.data.success) {
              setModalVisible(false);
              resetForm();
              actionCallback();
              message.success({ content: 'User lims clients updated', key: 'userClientLims', duration: 10 });
            } else {
              message.error({ content: 'A error occur', key: 'userClientLims', duration: 10 });
            }
          })
          .catch((error) => {
            setSubmitting(false);
            message.error({ content: 'A error occur', key: 'userClientLims', duration: 10 });
            console.log("error", error)
          });
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
            <Modal
              visible={modalVisible}
              title="Allocate Addresses"
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button key="back" onClick={() => setModalVisible(false)}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={false}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              ]}
            >
              <div className="inputContainer">
                <div className="inputContainer">
                  <Field
                    component={Select}
                    name="addresses"
                    style={{ width: "100%" }}
                    mode="multiple"
                    onDropdownVisibleChange={(open) => open ? getAddresses() : null}
                    onSelect={selectAddress}
                    onDeselect={deselectAddress}
                    filterOption={true}
                    optionFilterProp={'content'}
                    value={selectedAddresses.map(elem => elem.id)}
                  >
                    {addresses.map((elem) => (
                      <Select.Option key={elem.id} value={elem.id} content={elem.addressid} >
                        {elem.addressid}
                      </Select.Option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="addresses"
                    render={(msg) => <Typography.Text type="danger">{msg}</Typography.Text>}
                  />
                </div>
              </div>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}

function MoreActions(props) {
  const { record, actionCallback } = props
  const [changePWModalVisible, setchangePWModalVisible] = useState(false);
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
    newPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const activateUser = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/activate",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User enabled', key: 'userActivated', duration: 10 });
        actionCallback();
      } else {
        message.error({ content: 'A error occur', key: 'userActivated', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userActivated', duration: 10 });
      console.log("error", error)
    });
  }

  const disableUser = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/disable",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User disabled', key: 'userDisable', duration: 10 });
        actionCallback();
      } else {
        message.error({ content: 'A error occur', key: 'userDisable', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userDisable', duration: 10 });
      console.log("error", error)
    });
  }

  const resetUserPassword = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/resetPassword",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User password reseted', key: 'userPasswordReset', duration: 10 });
        actionCallback();
      } else {
        message.error({ content: 'A error occur', key: 'userPasswordReset', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userPasswordReset', duration: 10 });
      console.log("error", error)
    });
  }

  return (
    <>
      <Button.Group size="small">
        {record.status !== 1 && <Popconfirm
          title="Are you sure you want to activate this User?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => activateUser(record.id)}
          placement="topRight"
        >
          <Tooltip title='Activate'>
            <Button type="default" size="small" icon="like"/>
          </Tooltip>
        </Popconfirm>}
        {record.status !== "0" && <Popconfirm
          title="Are you sure you want to disable this User?"
          okText="Yes"
          cancelText="No"
          placement="topRight"
          onConfirm={() => disableUser(record.id)}
        >
          <Tooltip title='Disable'>
            <Button type="default" size="small" icon="dislike"/>
          </Tooltip>
        </Popconfirm>}
        {record.status !== "2" && record.status !== "0" && <Tooltip title='Change Suspend'>
          <Button type="default" size="small" icon="stop" onClick={() => setSuspendModalVisible(true)}/>
        </Tooltip>}
        { record.internalAccount && <Tooltip title='Change password'>
          <Button type="default" size="small" icon="swap" onClick={() => setchangePWModalVisible(true)}/>
        </Tooltip>}
          
        { record.internalAccount && <Popconfirm
          title={`A new password will be generate for the user.\nAre you sure you want to reset the User password?`}
          okText="Yes"
          cancelText="No"
          placement="topRight"
          onConfirm={() => resetUserPassword(record.id)}
        >
          <Tooltip title='Reset password'>
            <Button type="default" size="small" icon="lock"/>
          </Tooltip>
        </Popconfirm>}
      </Button.Group>

      <Formik
        initialValues={{
          password: "",
          newPassword: "",
        }}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          axios.post(
            process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/changePassword",qs.stringify({
              lutilisateur: record.id,
              newPassword:data.newPassword,
            })
          )
          .then((res) => {
            setSubmitting(false);
            if (res.data.status === 'success') {
              setchangePWModalVisible(false);
              resetForm();
              message.success({ content: res.data.msg, key: 'userPasswordChange', duration: 10 });
            } else {
              message.error({ content: res.data.msg, key: 'userPasswordChange', duration: 10 });
            }
          })
          .catch((error) => {
            setSubmitting(false);
            message.error({ content: 'A error occur', key: 'userPasswordChange', duration: 10 });
            console.log("error", error)
          });
        }}
        validationSchema={passwordSchema}
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
            <Modal
              visible={changePWModalVisible}
              title="Change password"
              onCancel={() => setchangePWModalVisible(false)}
              footer={[
                <Button key="back" onClick={() => setchangePWModalVisible(false)}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ]}
            >
              <FInput
                key="password"
                name="password"
                label="Pasword"
              />
              <FInput
                key="newPassword"
                name="newPassword"
                label="New password"
              />
            </Modal>
          </Form>
        )}
      </Formik>
      <Formik
        initialValues={{
          reason: "",
        }}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          axios.post(
            process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/suspend",qs.stringify({
              userRow: record.id,
              reason:data.reason,
            })
          )
          .then((res) => {
            setSubmitting(false);
            if (res.data.success) {
              setSuspendModalVisible(false);
              resetForm();
              actionCallback();
              message.success({ content: 'User account suspended', key: 'userSuspend', duration: 10 });
            } else {
              message.error({ content: 'A error occur', key: 'userSuspend', duration: 10 });
            }
          })
          .catch((error) => {
            setSubmitting(false);
            message.error({ content: 'A error occur', key: 'userSuspend', duration: 10 });
            console.log("error", error)
          });
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
            <Modal
              visible={suspendModalVisible}
              title="Suspend user"
              onCancel={() => setSuspendModalVisible(false)}
              footer={[
                <Button key="back" onClick={() => setSuspendModalVisible(false)}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ]}
            >
              <div className="inputContainer">
                  <label htmlFor="disable">Reason</label>
                  <Input.TextArea                   
                    key="reason"
                    name="reason"
                    label="reason"
                    rows={4} 
                  />
              </div>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
}

class DatatableUserConfig extends React.Component {
  state = {
    search: '',
    pagination: {
      total: null,
      current: 1,
      pageSize: 10
    },
    sorter: {
      field: 'username',
      order: 'asc',
    },
    loading: false,
    data: [],
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState,) {
    if (
      prevState.pagination.current !== this.state.pagination.current ||
      prevState.sorter.field !== this.state.sorter.field ||
      prevState.sorter.order !== this.state.sorter.order||
      prevState.search !== this.state.search
    ) {
      this.fetch({search: this.state.search});
    }
  }

  setSearch = (value) => {
    this.setState({
      search: value
    })
  }

  handleChangeId = (val) => {
    this.setState({ userInfo: val });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    
    const sort = {...this.state.sorter}
    sort.field = sorter && sorter.field ? sorter.field : sort.field
    sort.order = sorter && sorter.field ? sorter.order : sort.order

    this.setState({
      pagination: pager,
      sorter: sort,
    });
  };

  fetch = ({search = null} = {}) => {
    const { pagination, sorter } = this.state;
    this.setState({ loading: true });
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user",
      {
        params: {
          length : pagination.pageSize,
          start: pagination.pageSize * (pagination.current - 1),
          field: sorter.field,
          order: sorter.order,
          search: search || ''
        }
      }
    )
    .then((res) => {
      if (res.statusText === "OK") {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.recordsFiltered;
        this.setState({
          loading: false,
          data: res.data.results,
          pagination,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    })
    .catch((error) => {
      console.log("error", error)
      this.setState({
        loading: false,
      });
    });
  };

  activateUser = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/activate",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User enabled', key: 'userActivated', duration: 10 });
        this.fetch({search: this.state.search})
      } else {
        message.error({ content: 'A error occur', key: 'userActivated', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userActivated', duration: 10 });
      console.log("error", error)
    });
  }

  disableUser = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/disable",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User disabled', key: 'userDisable', duration: 10 });
        this.fetch({search: this.state.search})
      } else {
        message.error({ content: 'A error occur', key: 'userDisable', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userDisable', duration: 10 });
      console.log("error", error)
    });
  }

  resetUserPassword = (id) => {
    axios.post(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/user/resetPassword",qs.stringify({
        userRow:id,
      })
    )
    .then((res) => {
      if (res.data.success) {
        message.success({ content: 'User password reseted', key: 'userPasswordReset', duration: 10 });
        this.fetch({search: this.state.search})
      } else {
        message.error({ content: 'A error occur', key: 'userPasswordReset', duration: 10 });
      }
    })
    .catch((error) => {
      message.error({ content: 'A error occur', key: 'userPasswordReset', duration: 10 });
      console.log("error", error)
    });
  }

  render() {
      const columns = [
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
          sorter: true,
          defaultSortOrder: "ascend",
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: true,
        },
        {
          title: "Surname",
          dataIndex: "surname",
          key: "surname",
          sorter: true,
        },
        {
          title: "Date Created",
          dataIndex: "dateCreated",
          key: "dateCreated",
          sorter: true,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          sorter: true,
          align: 'center',
          render: status => (
            <Tag color={status === 1 ? 'green' : status === 2 ? 'orange' : 'red'}>
              {status === 1 ? 'activated' : status === 2 ? 'suspended' : 'disabled'}
            </Tag>
          ),
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          sorter: true,
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          sorter: false,
          render: (role, record) => (
            <UserRole role={role} record={record} actionCallback={() => this.fetch({search: this.state.search})}/>
          ),
        },
        {
          title: "Lims Clients",
          dataIndex: "clientLims",
          key: "clientLims",
          sorter: false,
          align: 'center',
          render: (clientLims, record) => (
            <UserClientLims clientLims={clientLims} record={record} actionCallback={() => this.fetch({search: this.state.search})}/>
          ),
        },
        {
          title: "Type",
          dataIndex: "internalAccount",
          key: "internalAccount",
          sorter: false,
          align: 'center',
          render: type => (
            <Tag>
              {type ? 'Internal' : 'External'}
            </Tag>
          ),
        },
        {
          title: "More actions",
          dataIndex: "actions",
          key: "actions",
          sorter: false,
          align: 'center',
          render: (text, record) => (
            <MoreActions record={record} actionCallback={() => this.fetch({search: this.state.search})}/>
          ),
        },
      ];
      return (
        <>
        <div className="col-xl-12 d-flex">
          <div style={{ margin: 5 }}>
            <Input.Search
              size="large"
              placeholder="Search"
              onSearch={this.setSearch}
              allowClear={true}
            />
          </div>
          <div style={{ margin: 5 }}>
            <Tooltip title='Refresh user list'>
              <Button size="large" onClick={() => this.fetch({search: this.state.search})}><Icon type="retweet" /></Button>
            </Tooltip>
          </div>
          <div style={{ margin: 5 }}>
            <ModalAddUser />
          </div>
        </div>


        <div className="col-xl-12">
          <Portlet
            className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
            fluidHeight={true}
          >
            <PortletBody>
              <Table
                style={{ backgroundColor: "white" }}
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
            </PortletBody>
          </Portlet>
        </div>
        </>
      );
}
}
export default withRouter(DatatableUserConfig);
