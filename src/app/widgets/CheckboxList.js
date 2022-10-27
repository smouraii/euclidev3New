import React, { useState } from "react";
import { Checkbox } from "antd";
import {
  PortletHeader,
  PortletBody,
  Portlet
} from "../partials/content/Portlet";

const CheckboxGroup = Checkbox.Group;

const euclide = [
  "Lims",
  "Mail Server",
  "DB Configuration",
  "Security Roles",
  "User Configuration",
  "Audit Configuration",
  "Efiles Configuration"
];

const dashboard = ["Request per Status", "Sample Per Request"];
const eFiles = ["Efiles Client"];
const bugReport = ["Report list", "Error log", "Audit log", "Online users"];
const DDC = [
  "Analysis Request",
  "Adresse",
  "Adresse Billing",
  "AddReportTo",
  "AdresseList",
  "PostMessage",
  "MessageList"
];
const defaultCheckedList = [];

export default function CheckboxList(props) {
  
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [checkedListDashboard, setCheckedListDashboard] = useState();
  const [checkedListEFiles, setCheckedListEFiles] = useState();
  const [checkedListBugReport, setCheckedListBugReport] = useState();
  const [checkedListDDC, setCheckedListDDC] = useState();

  const [indeterminate, setIndeterminate] = useState(true);
  const [indeterminateDashboard, setIndeterminateDashboard] = useState(true);
  const [indeterminateEFiles, setIndeterminateEFiles] = useState(true);
  const [indeterminateBugReport, setIndeterminateBugReport] = useState(true);
  const [indeterminateDDC, setIndeterminateDDC] = useState(true);


  const [checkAll, setCheckAll] = useState(false);
  const [checkAllDashboard, setCheckAllDashboard] = useState(false);
  const [checkAllEFiles, setCheckAllEFiles] = useState(false);
  const [checkAllBugReport, setCheckAllBugReport] = useState(false);
  const [checkAllDDC, setCheckAllDDC] = useState(false);

  const onChange = checkAll => {
    setCheckAll(checkAll);
    setIndeterminate(
      !!checkAll.length && checkAll.length < euclide.length,

    );
    setCheckAll(checkedList.length === euclide.length,
      );
  };

  const onCheckAllChange = e => {
    setCheckAll(e.target.checked);
    setCheckedList(e.target.checked ? euclide : []);
    setIndeterminate(false);
  };
  
  const onChangeDashboard = checkAllDashboard => {
    setCheckAllDashboard(checkAllDashboard);
    setIndeterminateDashboard(
      !!checkAllDashboard.length && checkAllDashboard.length < dashboard.length,

    );
    setCheckAllDashboard(checkedListDashboard.length === dashboard.length,
      );
  };

  const onCheckAllChangeDashboard = e => {
    setCheckAllDashboard(e.target.checked);
    setCheckedListDashboard(e.target.checked ? dashboard : []);
    setIndeterminateDashboard(false);
  };



  
  
  const onChangeEFiles = checkAllEFiles => {
    setCheckAllEFiles(checkAllEFiles);
    setIndeterminateEFiles(
      !!checkAllEFiles.length && checkAllEFiles.length < eFiles.length,

    );
    setCheckAllEFiles(checkedListEFiles.length === eFiles.length,
      );
  };

  const onCheckAllChangeEfiles = e => {
    setCheckAllEFiles(e.target.checked);
    setCheckedListEFiles(e.target.checked ? eFiles : []);
    setIndeterminateEFiles(false);
  };




  const onChangeBugReport = checkAllBugReport => {
    setCheckAllBugReport(checkAllBugReport);
    setIndeterminateBugReport(
      !!checkAllBugReport.length && checkAllBugReport.length < bugReport.length,

    );
    setCheckAllBugReport(checkedListBugReport.length === bugReport.length,
      );
  };

  const onCheckAllChangeBugReport = e => {
    setCheckAllBugReport(e.target.checked);
    setCheckedListBugReport(e.target.checked ? bugReport : []);
    setIndeterminateBugReport(false);
  };





  const onChangeDDC = checkAllDDC => {
    setCheckAllDDC(checkAllDDC);
    setIndeterminateDDC(
      !!checkAllDDC.length && checkAllDDC.length < DDC.length,

    );
    setCheckAllDDC(checkedListDDC.length === DDC.length,
      );
  };

  const onCheckAllChangeDDC = e => {
    setCheckAllDDC(e.target.checked);
    setCheckedListDDC(e.target.checked ? DDC : []);
    setIndeterminateDDC(false);
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
                  <div className="site-checkbox-all-wrapper">
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    >
                      Euclide
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={euclide}
                    value={checkedList}
                    onChange={onChange}
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
                  <div className="site-checkbox-all-wrapper">
                    <Checkbox
                      indeterminateDashboard={indeterminateDashboard}
                      onChange={onCheckAllChangeDashboard}
                      checked={checkAllDashboard}
                    >
                      Dashboard
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={dashboard}
                    value={checkedListDashboard}
                    onChange={onChangeDashboard}
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
                  <div className="site-checkbox-all-wrapper">
                    <Checkbox
                      indeterminate={indeterminateEFiles}
                      onChange={onCheckAllChangeEfiles}
                      checked={checkAllEFiles}
                    >
                      eFiles
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={eFiles}
                    value={checkedListEFiles}
                    onChange={onChangeEFiles}
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
                  <div className="site-checkbox-all-wrapper">
                    <Checkbox
                      indeterminate={indeterminateBugReport}
                      onChange={onCheckAllChangeBugReport}
                      checked={checkAllBugReport}
                    >
                      Bug Report
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={bugReport}
                    value={checkedListBugReport}
                    onChange={onChangeBugReport}
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
                  <div className="site-checkbox-all-wrapper">
                    <Checkbox
                      indeterminate={indeterminateDDC}
                      onChange={onCheckAllChangeDDC}
                      checked={checkAllDDC}
                    >
                      DDC
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={DDC}
                    value={checkedListDDC}
                    onChange={onChangeDDC}
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
