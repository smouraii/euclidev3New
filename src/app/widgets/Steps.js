import React, { useState } from "react";
import Api from "../pages/home/data/Api.json";
import { Button, Steps, Table } from "antd";
import NewRequest from "../pages/home/NewRequest";
import { Portlet, PortletBody } from "../partials/content/Portlet";
import queryString from "query-string";
import { Form, Formik } from "formik";
import axios from "axios";
import Confirmation from "./Confirmation";
import lodash from "lodash";

export default function StepsNewRequest(props) {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [wizardData, setWizardData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [stepInitialValues, setStepInitialValues] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [saveData, setSaveData] = useState(null);
  const [formState, setFormState] = useState(null);

  const parsed = queryString.parse(props.location.search);

  console.log("WizardData", wizardData);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getWizard`, {
        params: {
          wizardId: parsed.wizardid,
          fluxId: parsed.fluxId,
        },
        withCredentials: true,
      })
      .then((res) => setData(res.data));
  }, []);


  React.useEffect(() => {
    if (
      !data ||
      !templateData ||
      !data.steps[current] ||
      !data.steps[current].sdcid ||
      !data.steps[current].id ||
      !data.steps[current].fields
    ) {
      return;
    }
    console.log("templateData",templateData)
    //add workItems here
    let objToFill = {};
    const stepData = templateData[data.steps[current].id];
    console.log("stepData", stepData);
    if (data.steps[current].dataset !== null) {
      objToFill = {
        [data.steps[current].id]: stepData.map((elem, index) => ({
          ...data.steps[current].fields.reduce(
            (accum, field) => ({
              ...accum,
              [field.sdccolumnid]: lodash.get(
                elem[data.steps[current].sdcid][field.sdccolumnid],
                "id",
                elem[data.steps[current].sdcid][field.sdccolumnid]
              ),
            }),
            {}
          ),
          ...(data.steps[current].dataset.sdcid !== null
            ? {
                [data.steps[current].dataset.sdcid]: elem[
                  data.steps[current].dataset.sdcid
                ].map((dataset) => ({
                  datasetId: dataset.datasetId,
                  datasetName: dataset.datasetName,
                })),
              }
            : {}),
        })),
      };
    } else {
      objToFill = data.steps[current].fields.reduce(
        (accumulateur, field) => ({
          ...accumulateur,
          [data.steps[current].id + "_" + field.sdccolumnid]: lodash.get(
            stepData[data.steps[current].sdcid][field.sdccolumnid],
            "id",
            stepData[data.steps[current].sdcid][field.sdccolumnid]
          ),
        }),
        {}
      );
    }
    setStepInitialValues(objToFill);
    console.log("StepInitialValues", stepInitialValues);
    console.log("ObjtoFill", objToFill);
  }, [data, templateData, current,wizardData]);

  React.useEffect(() => {
    if(!data || !wizardData || !data.steps[current])return;
    // console.log(
    //   "dataSteps",
    //   data,
    //   wizardData,
    //   wizardData[data.steps[current].id],
    //   data.steps[current],
    //   data.steps[current].sdcid,
    //   data.steps[current].id,
    //   data.steps[current].fields
    // );
    console.log("condition",  !data ||
    !data.steps[current] ||
    !wizardData ||
    !wizardData[data.steps[current].id],
    data.steps[current])
  }, [data,wizardData, current]);

  React.useEffect(() => {
    if (
      !data ||
      !data.steps[current] ||
      !wizardData ||
      !wizardData[data.steps[current].id]
    )
      return;
    let objToFill = {};
    if (data.steps[current].dataset !== null) {
      objToFill = {
        [data.steps[current].id]: wizardData[data.steps[current].id][
          data.steps[current].id
        ].map((elem, index) => ({
          ...data.steps[current].fields.reduce(
            (accum, field) => ({
              ...accum,
              [field.sdccolumnid]:
                elem[field.sdccolumnid],
            }),
            {}
          ),
          ...(data.steps[current].dataset.sdcid !== null
            ? {
                [data.steps[current].dataset.sdcid]: elem[
                  data.steps[current].dataset.sdcid
                ].map((dataset) => ({
                  id: dataset.datasetId,
                  text: dataset.datasetName,
                })),
              }
            : {}),
        })),
      };
      console.log("popo")
    } else {
      objToFill = {
        [data.steps[current].id]: {
          [data.steps[current].sdcid]: data.steps[current].fields.reduce(
            (accum, field) => ({
              ...accum,
              [field.sdccolumnid]:
                wizardData[data.steps[current].id][
                  data.steps[current].id + "_" + field.sdccolumnid
                ],
            }),
            {}
          )}};
          console.log("pipi")
    }
    setFormState({...formState,...objToFill});
    console.log("formState",formState)

  }, [data, current, wizardData]);

  React.useEffect(()=>{
    let mapSave = {};
    mapSave = {
      id: parsed.wizardid,
      template: selectedTemplate,
      flux_id: parsed.fluxId,
      submit: false,
      ...formState,
    };
    setSaveData(mapSave);
    console.log("saveData", mapSave);
  },[formState])
  const prev = () => {
    setCurrent(current - 1);
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const { Step } = Steps;

  return (
    <div>
      {/* add step save (send a request with save API)  */}
      <Portlet>
        {data !== null && data.steps && (
          <PortletBody
            className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
            fluidHeight={true}
          >
            <Steps style={{ margin: 5 }} current={current}>
              {data.steps.map((step) => (
                <Steps.Step key={step.title} title={step.title} />
              ))}
              <Step title="confirmation" />
            </Steps>
            {current !== data.steps.length && (
              <NewRequest
                prev={prev}
                next={next}
                current={current}
                wizardData={wizardData}
                wizardid={parsed.wizardid}
                fluxId={parsed.fluxId}
                setWizardData={setWizardData}
                stepInitialValues={stepInitialValues}
                setStepInitialValues={setStepInitialValues}
                key={data.steps[current].id}
                step={data.steps[current]}
                sdcid={data.steps[current].sdcid}
                dataset={
                  data.steps[current].dataset &&
                  data.steps[current].dataset.sdcid
                }
                stepsLength={data.steps.length}
                templateData={templateData}
                setTemplateData={setTemplateData}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                saveData={saveData}
              />
            )}
            {current >= data.steps.length && wizardData && (
              <>
                {data.steps.map((step) => (
                  <Confirmation
                    templateData={templateData}
                    current={current}
                    data={data}
                    wizardData={wizardData}
                    prev={prev}
                    step={step}
                  />
                ))}
                <Button
                  type="primary"
                  style={{ float: "left" }}
                  onClick={() => prev()}
                >
                  Previous
                </Button>
                <Button type="submit" style={{ float: "right" }}>
                  Submit
                </Button>
              </>
            )}
            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={
                (() =>
                  // axios.post(
                  //   process.env.REACT_APP_HOST + "/EuclideV2/Savelink",
                  //   { saveData },
                  //   { withCredentials: true }
                  // ),
                console.log("saveDataClick", saveData))
              }
            >
              Save
            </Button>
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}
