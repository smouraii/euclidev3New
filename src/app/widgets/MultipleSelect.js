import React, { useEffect, useState } from "react";
import { Select } from "antd";
import Axios from "axios";
import { useFormikContext, Field } from "formik";

export default function MultipleSelect(props) {
  const [selectedItems, setSelectedItems] = useState([]);
 ;

  const { setFieldValue,values } = useFormikContext();

  const handleChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };



  // const filteredOptions = data.filter((o) => !selectedItems.includes(o.name));
  return (
    <Field
      component={Select}
      mode="multiple"
      placeholder="Choose a Dataset"
      name={props.name}
      onSelect={(val) => setFieldValue(props.name, val)}
      value={
        values[props.step][props.valueIndex][props.dataset.sdcid] &&
        values[props.step][props.valueIndex][props.dataset.sdcid] !== []
          ? values[props.step][props.valueIndex][props.dataset.sdcid].map(
              (elem, index) => elem.datasetName
            )
          : selectedItems
      }
      onChange={handleChange}
      style={{ width: "100%" }}
    >
      {props.datasetData && props.datasetData.map((item) => (
        <Select.Option key={item.id} value={item.name}>
          {item.name}
        </Select.Option>
      ))}
    </Field>
  );
}
