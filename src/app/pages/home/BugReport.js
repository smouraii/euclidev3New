import React from "react";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import ModalForm from "../../widgets/ModalForm";
import RefreshButton from "../../widgets/RefreshButton";
import { Tabs, Icon } from "antd";
import DatatableBugReport from "../../widgets/DatatableBugReport";

const { TabPane } = Tabs;

export default function BugReport() {
  const [isFull, setIsFull] = React.useState(false);

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
                <div className="d-flex justify-content-end">
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
                        <ModalForm />
                      </PortletBody>
                    </Portlet>
                  </div>
                </div>

                
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-dark">
                        <PortletBody heightfluid={true} fit={true}>
                          <DatatableBugReport isFull={isFull} />
                        </PortletBody>
                      </Portlet>
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
                <div className="d-flex justify-content-end">
                  <div style={{ margin: 5 }}>
                    <Portlet>
                      <PortletBody fit={true}>
                        <RefreshButton />
                      </PortletBody>
                    </Portlet>
                  </div>
                </div>

               
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-dark">
                        <PortletBody heightfluid={true} fit={true}>
                          <DatatableBugReport isFull={isFull} />
                        </PortletBody>
                      </Portlet>
                    </div>
                
              </PortletBody>
            </TabPane>
          </Tabs>
        </PortletBody>
      </Portlet>
    </>
  );
}
