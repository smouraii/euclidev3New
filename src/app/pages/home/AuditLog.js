import React from "react";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import ModalForm from "../../widgets/ModalForm";
import RefreshButton from "../../widgets/RefreshButton";
import { Tabs, Icon } from "antd";
import DatatableAuditLog from "../../widgets/DatatableAuditLog";
import DatatableOnlineUser from "../../widgets/DatatableOnlineUser";
import DatePickerComp from "../../widgets/DatePicker";


const { TabPane } = Tabs;

export default function AuditLog() {
  return (
    <>
      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
        <PortletBody heightfluid={true}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <Icon type="folder-open" />
                  Opened
                </span>
              }
              key="1"
            >
              <PortletBody heightfluid={true}>
                <div className="row d-flex justify-content-end">
                  <div style={{ margin: 5 }}>
                    <Portlet>
                      <PortletBody fit={true}>
                        <RefreshButton />
                      </PortletBody>
                    </Portlet>
                  </div>
                  <div style={{ margin: 5 }}>
                    <Portlet>
                      <PortletBody fit={true}>
                        <DatePickerComp />
                      </PortletBody>
                    </Portlet>
                  </div>

                  <div className="col-md-12">
                    <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                      <PortletBody fit={true}>
                        <DatatableAuditLog />
                      </PortletBody>
                    </Portlet>
                  </div>
                </div>
              </PortletBody>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="file-zip" />
                  Archived
                </span>
              }
              key="2"
            >
              <PortletBody heightfluid={true}>
                <div className="row d-flex justify-content-end">
                  <div style={{ margin: 5 }}>
                    <Portlet>
                      <PortletBody fit={true}>
                        <RefreshButton />
                      </PortletBody>
                    </Portlet>
                  </div>


                  <div className="col-md-12">
                    <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                      <PortletBody fit={true}>
                        <DatatableOnlineUser />
                      </PortletBody>
                    </Portlet>
                  </div>
                </div>
              </PortletBody>
            </TabPane>
          </Tabs>
        </PortletBody>
      </Portlet>
    </>
  );
}
