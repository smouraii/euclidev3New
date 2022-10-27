import React, { useState } from "react";
import { Button, Table, Descriptions } from "antd";
import { Form } from "formik";

export default function Confirmation(props) {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState();


  //mao into the props of wizard first then get the data from wizardData
  //test if array lenght is 0 verify if

  React.useEffect(() => {
    if (props.step.dataset === null) return;
    const mapColumns = props.step.fields.map((field, index) => ({
      key: field.sdccolumnid,
      title: field.columntitle || field.sdccolumnid,
      dataIndex: field.sdccolumnid,
    }));
    setColumns(mapColumns);
  }, [props.wizardData]);

  React.useEffect(() => {
    if (
      props.step.dataset === null ||
      !props.wizardData[props.step.id] ||
      !props.wizardData[props.step.id][props.step.id]
    ) {
      return;
    }

    const mapData = props.wizardData[props.step.id][props.step.id].map((elem) => ({
      ...props.step.fields.reduce(
        (accum, field) => ({
          ...accum,
          [field.sdccolumnid]:
            elem[field.sdccolumnid],
        }),
        {}
      ),
      ...(props.step.dataset.sdcid !== null
        ? {
            [props.step.dataset.sdcid]: elem[props.step.dataset.sdcid].map(
              (dataset) => ({
                datasetName: dataset.datasetName,
              })
            ),
          }
        : {}),
    }));
    setDataSource(mapData);
  }, [props.wizardData, props.step.dataset]);


  return (
    <>
      {props.step.dataset === null && (
        <Descriptions title={props.step.id}>
          {props.step.fields.map((field) => (
            <Descriptions.Item label={field.sdccolumnid}>
              {
                props.wizardData[props.step.id][
                  props.step.id + "_" + field.sdccolumnid
                ]
              }
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}

      {dataSource && props.step.dataset !== null && (
        <Table
          dataSource={dataSource}
          name={props.step.id}
          title={() => props.step.id}
          rowKey={(row, index) => "" + index}
          pagination={false}
          rowSelection={{
            columnWidth: 100,
          }}
          columns={columns}
        />
      )}
    </>
  );
}
