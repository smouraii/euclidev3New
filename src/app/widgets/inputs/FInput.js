import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Input, Typography } from "antd";
const { Text } = Typography;

export default function FInput(props) {
  return (
    <div className="inputContainer">
      <label htmlFor={props.name}>{props.label}</label>
      <Field
        as={Input}
        name={props.name}
        placeholder={props.label}
        disabled={props.readonly}
        hidden={props.hidden}
      ></Field>
      <p style={{ margin: 0 }}>{props.instructionaltext}</p>
      <ErrorMessage
        name={props.name}
        render={(msg) => <Text type="danger">{msg}</Text>}
      />
    </div>
  );
}
