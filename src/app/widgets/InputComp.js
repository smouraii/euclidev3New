import React from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";

import { Portlet, PortletBody } from "../partials/content/Portlet";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


class InputComp extends React.Component {
   

  render() {
    
    

    return (
<>


<div className="row d-flex justify-content-center" ><h3 style={{color: "white"}}>{this.props.title}</h3></div>
        <Portlet>   
        <PortletBody fit={true}>
              <div className="input-content">{this.props.content}</div>
      </PortletBody>
      </Portlet>
      </>
    );
  }
}


export default InputComp;
