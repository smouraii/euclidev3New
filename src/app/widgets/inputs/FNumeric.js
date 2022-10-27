import React from "react";
import { Field, ErrorMessage } from "formik";
import { Input } from "antd";

export default function FNumeric(props) {
  return (
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <Field
        style={{ width: "100%" }}
        as={Input}
        name={props.name}
        placeholder={props.label || props.name}
        disabled={props.readonly}
        hidden={props.hidden}
      ></Field>
      <p style={{ margin: 0 }}>{props.instructionaltext}</p>
      <ErrorMessage
        name={props.name}
        render={(msg) => <span style={{ color: "red" }}>{msg}</span>}
      />
    </div>
  );
}
