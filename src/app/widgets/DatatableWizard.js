import { Table, AddRowButton, RemoveRowButton, Form } from "formik-antd";
import React, { useState } from "react";
import { Icon, Popconfirm, Tooltip } from "antd";
import FInput from "./inputs/FInput";
import FSelect from "./inputs/FSelect";
import FDate from "./inputs/FDate";
import FNumeric from "./inputs/FNumeric";
import "../../component.css";
import MultipleSelect from "./MultipleSelect";
import { useFormikContext } from "formik";
import DeleteForDatatableWizard from "./DeleteForDatatableWizard";

export default function DatatableWizard(props) {
  const [columns, setColumns] = useState([]);
  const dateFormat = "YYYY-MM-DD hh:mm:ss.S";

  const rendercolumn = (field, index) => {
    switch (field.columntype) {
      case "input":
        return (
          <div className="d-flex align-baseline">
            <FInput
              key={`${props.step}.${index}.${field.sdccolumnid}`}
              name={`${props.step}.${index}.${field.sdccolumnid}`}
              readonly={field.readonly}
              hidden={field.hidden}
              style={{ width: "100%" }}
            />
            {field.columnAddInstructionalText && (
              <Tooltip title={field.columnInstructionalText}>
                <Icon type="question-circle" />
              </Tooltip>
            )}
          </div>
        );
      case "select":
        return (
          <>
            <FSelect
              key={`${props.step}.${index}.${field.sdccolumnid}`}
              name={`${props.step}.${index}.${field.sdccolumnid}`}
              valueIndex={index}
              field={field.sdccolumnid}
              templateData={
                props.templateData[props.step][index] &&
                props.templateData[props.step][index][props.sdcid][
                  field.sdccolumnid
                ]
              }
              readonly={field.readonly}
              hidden={field.hidden}
              display={field.selectproperties.display}
              step={props.step}
              refsdcid={field.selectproperties.refsdcid}
              style={{ width: "100%" }}
            />
            {field.columnAddInstructionalText && (
              <Tooltip title={field.columnInstructionalText}>
                <Icon type="question-circle" />
              </Tooltip>
            )}
          </>
        );
      case "auto":
        return (
          <>
            <props.FAuto
              key={`${props.step}.${index}.${field.sdccolumnid}`}
              name={`${props.step}.${index}.${field.sdccolumnid}`}
              readOnly={field.readonly}
              hidden={field.hidden}
              dependsOnField={
                field.autoproperties.dependsOnField + index + props.step
              }
              fromSDC={field.autoproperties.fromSDC}
              fieldId={field.autoproperties.fieldId}
              type={field.autoproperties.type}
              autoproperties={field.autoproperties}
              refsdcid={field.autoproperties.refsdcid}
              displayValueColumnid={
                field.autoproperties.criteriaColumns[0].displayValueColumnid
              }
              style={{ width: "100%" }}
            />
            {field.columnAddInstructionalText && (
              <Tooltip title={field.columnInstructionalText}>
                <Icon type="question-circle" />
              </Tooltip>
            )}
          </>
        );
      case "date":
        return (
          <div className="d-flex justify-content-end">
            <FDate
              key={`${props.step}.${index}.${field.sdccolumnid}`}
              name={`${props.step}.${index}.${field.sdccolumnid}`}
              readonly={field.readonly}
              hidden={field.hidden}
              placeholder="please add date"
              format={dateFormat}
              style={{ width: "100%" }}
            />
            {field.columnAddInstructionalText && (
              <Tooltip title={field.columnInstructionalText}>
                <Icon type="question-circle" />
              </Tooltip>
            )}
          </div>
        );
      case "numeric":
        return (
          <div className="d-flex justify-content-end">
            <FNumeric
              key={`${props.step}.${index}.${field.sdccolumnid}`}
              name={`${props.step}.${index}.${field.sdccolumnid}`}
              readonly={field.readonly}
              hidden={field.hidden}
              style={{ width: "100%" }}
            />
            {field.columnAddInstructionalText && (
              <Tooltip title={field.columnInstructionalText}>
                <Icon type="question-circle" />
              </Tooltip>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (!props.columns && !props.dataset) return;
    const mapColumns = props.columns.map((field, index) => ({
      key: field.sdccolumnid,
      title: field.columntitle || field.sdccolumnid,
      dataIndex: field.sdccolumnid,
      render: (text, record, index) => rendercolumn(field, index),
    }));
    if (props.dataset !== null && props.dataset.sdcid !== null) {
      mapColumns.push({
        title: "Dataset",
        dataIndex: "dataset",
        key: "multiSelect",
        render: (text, record, index) => (
          <MultipleSelect
            step={props.step}
            dataset={props.dataset}
            sdcid={props.sdcid}
            valueIndex={index}
            record={record}
            name={props.dataset.sdcid}
            datasetData={props.datasetData}
          />
        ),
      });
    }
    mapColumns.push({
      title: "operation",
      dataIndex: "operation",
      key: "actions",
      align: "right",
      render: (record, index) => (
        //add a condition to only store deleted value if id !== null also add record to check the row deleted and a callback function
        <DeleteForDatatableWizard
          style={{ border: "none" }}
          icon="delete"
          name={props.step}
          index={index}
          onClick={(array) => {
            array.remove(props.index);
            console.log("array", array);
          }}
        />
      ),
    });
    setColumns(mapColumns);
  }, []);
  return (
    <>
      <AddRowButton
        name={props.step}
        style={{ marginBottom: 20 }}
        createNewRow={() => ({})}
      >
        Add
      </AddRowButton>
      <Table
        name={props.step}
        rowKey={(row, index) => "" + index}
        pagination={false}
        rowSelection={{
          columnWidth: 100,
        }}
        columns={columns}
      />
    </>
  );
}
