import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Input } from "antd";
import { DatePicker } from "antd";
import moment from "moment";


export default function FDate(props) {
  const { values } = useFormikContext();
  const dateFormat = "YYYY-MM-DD hh:mm:ss.S";

console.log("date",values[props.name])
  return (
    <div>
      <p htmlFor={props.name} style={{ margin: 0 }}>
        {props.label}
      </p>
      <Field
        style={{ width: "100%" }}
        component={DatePicker}
        name={props.name}
        placeholder={props.label}
        disabled={props.readonly}
        hidden={props.hidden}
        value={values[props.name] && values[props.name] !== "" 
                ? moment(values[props.name], dateFormat)
                : null}
        onChange={(val) => console.log(val)}
      ></Field>
      <p style={{ margin: 0 }}>{props.instructionaltext}</p>
      <ErrorMessage
        name={props.name}
        render={(msg) => <span style={{ color: "red" }}>{msg}</span>}
      />
    </div>
  );
}
