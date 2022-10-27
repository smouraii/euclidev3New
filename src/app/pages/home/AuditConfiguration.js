import React from "react";
import { Tabs, Icon, Button, Input, Select, Form } from "antd";
import {
  Portlet,
  PortletBody,
  PortletHeader,
} from "../../partials/content/Portlet";
import TreeComp from "../../widgets/TreeComp";

const { TabPane } = Tabs;
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default function AuditConfiguration() {
  return (
    <>
      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
        <PortletBody heightfluid={true}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <Icon type="book" />
                  Audit Log
                </span>
              }
              key="1"
            >
              <PortletBody heightfluid={true}>
                <TreeComp />
              </PortletBody>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="bug" />
                  Bug Report
                </span>
              }
              key="2"
            >
              <div class="form row">
                <div class="col-md-12">
                  <div class="row">
                    <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                      <PortletHeader title="Audit bugReport API" />
                      <PortletBody widthfluid={true}>
                        <div class="col-md-6">
                          <div class="form-group">
                            <div class="input-group">
                              <input
                                name="apiURL"
                                class="form-control"
                                value="https://bug.euclide.io/api/soap/mantisconnect.php"
                              />
                              <span class="input-group-btn">
                                <Button id="apiURL">Update</Button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </PortletBody>
                    </Portlet>
                    <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                      <PortletHeader title="BugReport synchronization" />
                      <PortletBody widthfluid={true}>
                        <div class="col-sm-12 col-md-12 col-lg-6">
                          <table class="table table-hover table-bordered">
                            <tbody>
                              <tr>
                                <td>issueReport customFields</td>
                                <td>
                                  <Button
                                    class="btn default"
                                    id="customFieldSync"
                                  >
                                    issueReport synchronize
                                  </Button>
                                </td>
                              </tr>
                              <tr>
                                <td>issueReport categories</td>
                                <td>
                                  <Button
                                    class="btn default"
                                    id="categoriesSync"
                                  >
                                    issueReport synchronize
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </PortletBody>
                    </Portlet>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="file-exclamation" />
                  Error Log Configuration
                </span>
              }
              key="3"
            >
              <Form>
                <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                  <PortletHeader title="Log Settings" />
                  <PortletBody heightfluid={true}>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="inputContainer">
                        <label htmlFor="fileName">File Name</label>
                        <Input
                          placeholder="File Name "
                          name="fileName"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <div className="inputContainer">
                        <label htmlFor="fileLocation">File Location</label>
                        <Input
                          placeholder="File Location"
                          name="fileLocation"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="logtype">Log Type</label>
                      <div>
                        <Select
                          defaultValue="dailyRolling"
                          name="LogType"
                          title="Log Type"
                          onChange={handleChange}
                        >
                          <Option value="dailyRolling">DAILY ROLLING</Option>
                          <Option value="rechSize">REACH SIZE</Option>
                        </Select>
                      </div>
                    </div>
                  </PortletBody>
                </Portlet>
              </Form>
            </TabPane>
          </Tabs>
        </PortletBody>
      </Portlet>
    </>
  );
}
