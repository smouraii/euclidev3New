import React, { useState } from "react";
import { Tree, Checkbox, Icon } from "antd";
import {
  Portlet,
  PortletBody,
  PortletHeader
} from "../partials/content/Portlet";

const { TreeNode } = Tree;


export default function TreeList({
  checkedKeys,
  setCheckedKeys,
  checkedKeysDashboard,
  setCheckedKeysDashboard,
  checkedKeysEFilesData,
  setCheckedKeysEFilesData,
  checkedKeysBugReport,
  setCheckedKeysBugReport,
  checkedKeysDDC,
  setCheckedKeysDDC,
  euclideData,
  dashboardData,
  bugReportData,
  eFilesData,
  DDCData
}) {
  const [expandedKeys, setExpandedKeys] = useState([
    "euclide",
    "dashboard",
    "eFilesData",
    "bugReport",
    "DDC"
  ]);

  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = expandedKeys => {
    console.log("onExpand", expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (keys, setKeys, e) => {
    console.log("onCheck", e);
    setKeys(e);
  };

  return (
    <>
      <Portlet
        className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
        fluidHeight={true}
      >
        <PortletBody>
          <div className="row d-flex justify-content-center">
            <div className="col-xl-4">
              <Portlet
                className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                fluidHeight={true}
              >
                <PortletHeader title="Euclide" />
                <PortletBody>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={e => onCheck(checkedKeys, setCheckedKeys, e)}
                    checkedKeys={checkedKeys}
                    treeData={euclideData}
                  />
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xl-4">
              <Portlet
                className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                fluidHeight={true}
              >
                <PortletHeader title="Dashboard" />
                <PortletBody>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={e =>
                      onCheck(checkedKeysDashboard, setCheckedKeysDashboard, e)
                    }
                    checkedKeys={checkedKeysDashboard}
                    treeData={dashboardData}
                  />
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xl-4">
              <Portlet
                className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                fluidHeight={true}
              >
                <PortletHeader title="eFiles" />
                <PortletBody>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={e =>
                      onCheck(
                        checkedKeysEFilesData,
                        setCheckedKeysEFilesData,
                        e
                      )
                    }
                    checkedKeys={checkedKeysEFilesData}
                    treeData={eFilesData}
                  />
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xl-4">
              <Portlet
                className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                fluidHeight={true}
              >
                <PortletHeader title="Bug Report" />
                <PortletBody>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={e =>
                      onCheck(checkedKeysBugReport, setCheckedKeysBugReport, e)
                    }
                    checkedKeys={checkedKeysBugReport}
                    treeData={bugReportData}
                  />
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xl-4">
              <Portlet
                className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                fluidHeight={true}
              >
                <PortletHeader title="Dynamic Domain Class" />
                <PortletBody>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={e => onCheck(checkedKeysDDC, setCheckedKeysDDC, e)}
                    checkedKeys={checkedKeysDDC}
                    treeData={DDCData}
                  />
                </PortletBody>
              </Portlet>
            </div>
          </div>
        </PortletBody>
      </Portlet>
    </>
  );
}
