import React, { useState, useEffect, useReducer } from "react";
import { Table, Icon, Tooltip, Tree, Button, Modal, message, Popconfirm, Input } from "antd";
import { Formik, Form, Field, ErrorMessage, useField, useFormikContext } from "formik";
import * as Yup from 'yup';
import {
  Portlet,
  PortletBody,
  PortletHeader,
} from "../../partials/content/Portlet";
import FInput from "../../widgets/inputs/FInput";
import axios from "axios";
import qs from "qs";

const euclideData = [
  {
    title: "Euclide",
    key: "euclide",
    children: [
      {
        title: "Lims",
        key: "Lims",
      },
      {
        title: "Mail Server",
        key: "MailServer",
      },
      {
        title: "DB Configuration",
        key: "DBConfiguration",
      },
      {
        title: "Security Roles",
        key: "SecurityRoles",
      },
      {
        title: "User Configuration",
        key: "UserConfiguration",
      },
      {
        title: "Audit Configuration",
        key: "Audit Configuration",
      },
      {
        title: "EFiles Configuration",
        key: "EFilesConfiguration",
      },
    ],
  },
];

const AuthorityField = (props) => {
  const {
    values: { role },
    touched,
    setFieldValue,
  } = useFormikContext();
  const [field, meta] = useField(props);

  React.useEffect(() => {
    if (
      role.trim() !== '' &&
      touched.role
    ) {
      setFieldValue(props.name, `ROLE_${role.toUpperCase().replace(/ /g,'_')}`);
    }
  }, [role, touched.role]);

  return (
    <FInput {...props} {...field} />
  );
};

const ModalAddRole = (props) => {
  const { callBack } = props;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const roleSchema = Yup.object().shape({
    role: Yup.string()
      .required('Required'),
    authority: Yup.string()
      .required('Required')
      .test('checkRoleUnique', 'This role already exist.', value =>
        axios.get(
          process.env.REACT_APP_HOST + "/EuclideV2/api/admin/roles/check",
          {
            params: {
              authority: value
            }
          }
        )
        .then(res => {
          return res.data.status == 'OK'
        }),
      ),
  });

  return (
    <div>
      <Button type="default" onClick={() => setVisible(true)}>
      <Icon type="usergroup-add" />Add User Role 
      </Button>
      <Formik
        initialValues={{
          role: "",
          authority: "",
        }}
        validationSchema={roleSchema}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          axios.post(
            process.env.REACT_APP_HOST + "/EuclideV2/api/admin/roles",qs.stringify({
              role_description:data.role,
              role_authority:data.authority,
            })
          )
          .then((res) => {
            setSubmitting(false);
            if (res.data.message == 'success') {
              setVisible(false);
              resetForm();
              callBack();
              message.success({ content: 'Role created', key: 'roleSave', duration: 10 });
            } else {
              message.error({ content: 'A error occur', key: 'roleSave', duration: 10 });
            }
          })
          .catch((error) => {
            setSubmitting(false);
            message.error({ content: 'A error occur', key: 'roleSave', duration: 10 });
            console.log("error", error)
          });
        }}
      >
        {({
          handleSubmit,
          resetForm
        }) => (
          <Form>
            
            <Modal
              visible={visible}
              title="New Folder"
              onCancel={() => {
                resetForm();
                setVisible(false);
              }}
              footer={[
                <Button key="back" onClick={() => {
                  resetForm();
                  setVisible(false);
                }}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ]}
            >
              <FInput
                key="role"
                name="role"
                label="User Roles Description"
              />
              <AuthorityField
                key="authority"
                name="authority"
                label="User Roles Authority"
                readonly={true}
              />
            </Modal>
          </Form>
        )}
      </Formik>
    </div>
  );
}

const ComponentTree = (props) => {
  const {component, checkedKeys, setCheckedKeys, disable} = props

  return (
    <div className="col-xl-4">
      <Portlet
        className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
        fluidHeight={true}
      >
        <PortletHeader title={component.title} />
        <PortletBody>
          <Tree
            checkable
            defaultExpandAll={true}
            treeData={[component]}
            onCheck={setCheckedKeys}
            checkedKeys= {checkedKeys}
            disabled={disable}
          />
        </PortletBody>
      </Portlet>
    </div>
  )
};

const ExpandedRowRender = (props) => {
  const {record, expanded, components, callBack} = props;
  const [activeNodes, setActiveNodes] = useReducer((state, action) => {
    return {
      ...state,
      [action.key] : action.selectedKeys
    }
  },[]);
  const [disable, setDisable] = useState(true)
  
  useEffect(() => {
    if (!expanded) {
      setDisable(true)
      components.forEach(
        (component) => setActiveNodes({
          key: component.key,
          selectedKeys: [
            ...(record.activeNodes.includes(component.key) ? [component.key] : []),
            ...component.children.filter(child => record.activeNodes.includes(child.key)).map(child => child.key)
          ]})
      )   
    }
  }, [expanded])

  useEffect(() => {
    components.forEach(
        (component) => setActiveNodes({
          key: component.key,
          selectedKeys: [
            ...(record.activeNodes.includes(component.key) ? [component.key] : []),
            ...component.children.filter(child => record.activeNodes.includes(child.key)).map(child => child.key)
          ]})
      )
  }, [components])

  const applyComponent = () => {
      axios.post(
        process.env.REACT_APP_HOST + "/EuclideV2/api/admin/security/roles",{
          components : Object.keys(activeNodes).reduce((components, node) => [...components, ...activeNodes[node]], []),
          role: record.id
        },
        {
          headers: {
            "content-type": "application/json",
          }
        }
      )
      .then((res) => {
        console.log(res)
        setDisable(!disable)
        callBack()
        message.success({ content: 'Security applied', key: 'securitySave', duration: 10 });
        // if (res.data.message == 'success') {
        //   setVisible(false);
        //   resetForm();
        //   callBack();
        //   message.success({ content: 'Role created', key: 'roleSave', duration: 10 });
        // } else {
        //   message.error({ content: 'A error occur', key: 'roleSave', duration: 10 });
        // }
      })
      .catch((error) => {
        message.error({ content: 'A error occur', key: 'roleSave', duration: 10 });
        console.log("error", error)
      });
  }

  return (
      expanded && <div className="row d-flex justify-content-center">
        <div className="col-xl-12 d-flex">
          <div style={{ marginBottom: 15 }}>
            <Button size="small" type={disable ? 'default' : 'primary'} onClick={() => disable ? setDisable(!disable) : applyComponent()}><Icon type={disable ? 'edit' : 'save'} />{disable ? 'Edit' : 'Save'}</Button>
          </div>
        </div>
      
          {
            components.map( component => (
              <ComponentTree 
                key={component.key}
                component={component}
                setCheckedKeys={(selectedKeys) => setActiveNodes({key: component.key, selectedKeys})}
                checkedKeys={activeNodes[component.key]}
                disable={disable}
              />
            ))
          }
      </div>
    )
}

const Role = (props) => {
  const { record, role, actionCallback } = props

  return (
    <Formik
        enableReinitialize={true}
        initialValues={{
          role: role,
        }}
        validationSchema={Yup.object().shape({
          role: Yup.string()
            .required('Required'),
        })}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          axios.put(
            process.env.REACT_APP_HOST + "/EuclideV2/api/admin/roles",qs.stringify({
              pk: record.id,
              value:data.role,
            })
          )
          .then((res) => {
            setSubmitting(false);
            if (res.data.message == 'success') {
              resetForm();
              actionCallback();
              message.success({ content: 'Role updated', key: 'roleUpdate', duration: 10 });
            } else {
              message.error({ content: 'A error occur', key: 'roleUpdate', duration: 10 });
            }
          })
          .catch((error) => {
            setSubmitting(false);
            message.error({ content: 'A error occur', key: 'roleUpdate', duration: 10 });
            console.log("error", error)
          });
        }}
      >
        {({
          handleSubmit,
          resetForm
        }) => (
          <Form>
            <Popconfirm
              title={<FInput
                key="role"
                name="role"
                value={role}
              />}
              onConfirm={handleSubmit}
              onCancel={() => resetForm()}
              placement="right"
              icon={null}
            >
              <Button type="dashed">{role}</Button>
            </Popconfirm>
          </Form>
        )}
      </Formik>
  )
}

export default function SecurityRoles() {
  const roleColumn = {
    title: "Role",
    dataIndex: "description",
    key: "id",
    render: (role, record) => (
      <Role role={role} record={record} actionCallback={() => fetchRoles()}/>
    ),
  }
  const [components, setComponents] = useState([
    ...euclideData,
  ])
  const [columns, setColumns] = useState([
    roleColumn,
  ])
  const [roles, setRoles] = useState([]);

  // Get Roles list at component mount
  useEffect(() => fetchRoles(), [])

  // Get DDC list at component mount
  useEffect(() => {
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/security/components"
    )
    .then((res) => {
      if (res.statusText === "OK") {

        setColumns([
          roleColumn,
          ...res.data.components.map(component => ({
            title: component.title,
            dataIndex: component.key,
            key: component.key,
            render: (data) => status(data, component.children.length)
          })),
        ])

        setComponents([
          ...res.data.components.map(component => ({
            title: component.title,
            key: component.key,
            children: component.children.map(child => ({
              title: child.title,
              key: child.key,
            }))
          })),
        ])
      }
    })
    .catch((error) => console.log("error", error));
  }, [roles])

  const status = (keys = 0, data) => {
    if (keys >= data) {
      return <Icon type="check" style={{ color: "green" }} />;
    } else if (1 <= keys && keys < data) {
      return <Icon type="check" style={{ color: "orange" }} />;
    } else if (keys === 0) {
      return <Icon type="minus" style={{ color: "red" }} />;
    }
  };

  const fetchRoles = () => {
    axios.get(
      process.env.REACT_APP_HOST + "/EuclideV2/api/admin/security/roles"
    )
    .then((res) => {
      if (res.statusText === "OK") {
        setRoles(res.data.roles);
      }
    })
    .catch((error) => console.log("error", error));
  }

  return (
    <>
      <div className="col-xl-12 d-flex">
        <div style={{ margin: 5 }}>
          <Tooltip title='Add role'>
            {/* <Button size="large" onClick={() => this.fetch({search: this.state.search})}><Icon type="retweet" /></Button> */}
            <ModalAddRole callBack={fetchRoles}/>
          </Tooltip>
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
              className="components-table-demo-nested"
              columns={columns}
              expandedRowRender={(record, index, indent, expanded) => <ExpandedRowRender components={components} record={record} expanded={expanded} callBack={fetchRoles}/>}
              dataSource={roles}
              pagination={false}
            />
          </PortletBody>
        </Portlet>
      </div>
    </>
  );
}
