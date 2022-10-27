import React, { useState } from "react";
import {
  Collapse,
  Progress,
  Button,
  Input,
  Select,
  Icon,
  InputNumber,
} from "antd";
import { Circle } from "rc-progress";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import { StaticRouter } from "react-router-dom";

const ButtonGroup = Button.Group;
const { Option } = Select;

export default function EfilesConfiguration() {
  const [stateSuperAdmin, setStateSuperAdmin] = useState(0);
  const [stateAdmin, setStateAdmin] = useState(0);
  const [stateClient, setStateClient] = useState(0);

  const [countSuperAdmin, setCountSuperAdmin] = useState(0);
  const [countAdmin, setCountAdmin] = useState(0);
  const [countClient, setCountClient] = useState(0);

  function onChange(value) {
    console.log("changed", value);
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const increaseSuperAdmin = () => {
    let percent = stateSuperAdmin + 1;
    if (percent > 100) {
      percent = 100;
    }
    setStateSuperAdmin(percent);
  };

  const declineSuperAdmin = () => {
    let percent = stateSuperAdmin - 1;
    if (percent < 0) {
      percent = 0;
    }
    setStateSuperAdmin(percent);
  };

  const plusSuperAdmin = () => {
    let percent = countSuperAdmin + 1;
    if (percent > 100) {
      percent = 100;
    }
    setCountSuperAdmin(percent);
  };

  const minusSuperAdmin = () => {
    let percent = countSuperAdmin - 1;
    if (percent < 0) {
      percent = 0;
    }
    setCountSuperAdmin(percent);
  };

  const plusAdmin = () => {
    let percent = countAdmin + 1;
    if (percent > 100) {
      percent = 100;
    }
    setCountAdmin(percent);
  };

  const minusAdmin = () => {
    let percent = countAdmin - 1;
    if (percent < 0) {
      percent = 0;
    }
    setCountAdmin(percent);
  };

    const increaseAdmin = () => {
      let percent = stateAdmin + 1;
      if (percent > 100) {
        percent = 100;
      }
      setStateAdmin(percent);
    };
  
    const declineAdmin = () => {
      let percent = stateAdmin - 1;
      if (percent < 0) {
        percent = 0;
      }
      setStateAdmin(percent);
    };
     const plusClient = () => {
    let percent = countClient + 1;
    if (percent > 100) {
      percent = 100;
    }
    setCountClient(percent);
  };

  const minusClient = () => {
    let percent = countClient - 1;
    if (percent < 0) {
      percent = 0;
    }
    setCountClient(percent);
  };
  const increaseClient = () => {
    let percent = stateClient + 1;
    if (percent > 100) {
      percent = 100;
    }
    setStateClient(percent);
  };

  const declineClient = () => {
    let percent = stateClient- 1;
    if (percent < 0) {
      percent = 0;
    }
    setStateClient(percent);
  };

  const { Panel } = Collapse;
  const superAdmin = (
    <div className="row justify-content-between ">
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={stateSuperAdmin}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={declineSuperAdmin} icon="minus" />
          <Button onClick={increaseSuperAdmin} icon="plus" />
        </ButtonGroup>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={countSuperAdmin}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={minusSuperAdmin} icon="minus" />
          <Button onClick={plusSuperAdmin} icon="plus" />
        </ButtonGroup>
      </div>

      <div className="d-flex flex-column bd-highlight mb-3">
        <div className="p-2 bd-highlight" style={{ marginLeft: 10 }}>
          <InputNumber
            defaultValue={30}
            min={0}
            max={100}
            formatter={(value) => `${value} days`}
            parser={(value) => value.replace(" days", "")}
            onChange={onChange}
          />
        </div>

        <div className="p-2 bd-highlight">
          <Select
            mode="multiple"
            placeholder="select your formats"
            style={{ width: 900, margin: 10 }}
            onChange={handleChange}
          >
            <Option value="word">
              <Icon type="file-word" />
              Word
            </Option>
            <Option value="excel">
              <Icon type="file-excel" />
              Excel
            </Option>
            <Option value="pdf">
              <Icon type="file-pdf" />
              Pdf
            </Option>

            <Option value="text">
              <Icon type="file-text" />
              Text
            </Option>
            <Option value="jpeg">
              <Icon type="file-jpg" />
              Jpeg
            </Option>
            <Option value="bitmap">
              <Icon type="file" />
              Bitmap
            </Option>
            <Option value="png">
              <Icon type="file-image" />
              Png
            </Option>
            <Option value="gif">
              <Icon type="file-exclamation" />
              Gif
            </Option>
          </Select>
        </div>
      </div>
    </div>
  );
  const admin = (
    <div className="row justify-content-between ">
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={stateAdmin}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={declineAdmin} icon="minus" />
          <Button onClick={increaseAdmin} icon="plus" />
        </ButtonGroup>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={countAdmin}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={minusAdmin} icon="minus" />
          <Button onClick={plusAdmin} icon="plus" />
        </ButtonGroup>
      </div>

      <div className="d-flex flex-column bd-highlight mb-3">
        <div className="p-2 bd-highlight" style={{ marginLeft: 10 }}>
          <InputNumber
            defaultValue={30}
            min={0}
            max={100}
            formatter={(value) => `${value} days`}
            parser={(value) => value.replace(" days", "")}
            onChange={onChange}
          />
        </div>

        <div className="p-2 bd-highlight">
          <Select
            mode="multiple"
            placeholder="select your formats"
            style={{ width: 900, margin: 10 }}
            onChange={handleChange}
          >
            <Option value="word">
              <Icon type="file-word" />
              Word
            </Option>
            <Option value="excel">
              <Icon type="file-excel" />
              Excel
            </Option>
            <Option value="pdf">
              <Icon type="file-pdf" />
              Pdf
            </Option>

            <Option value="text">
              <Icon type="file-text" />
              Text
            </Option>
            <Option value="jpeg">
              <Icon type="file-jpg" />
              Jpeg
            </Option>
            <Option value="bitmap">
              <Icon type="file" />
              Bitmap
            </Option>
            <Option value="png">
              <Icon type="file-image" />
              Png
            </Option>
            <Option value="gif">
              <Icon type="file-exclamation" />
              Gif
            </Option>
          </Select>
        </div>
      </div>
    </div>
  );
  const client = (
    <div className="row justify-content-between ">
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={stateClient}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={declineClient} icon="minus" />
          <Button onClick={increaseClient} icon="plus" />
        </ButtonGroup>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <Progress
          type="dashboard"
          percent={countClient}
          format={(percent) => `${percent} GB`}
        />
        <ButtonGroup>
          <Button onClick={minusClient} icon="minus" />
          <Button onClick={plusClient} icon="plus" />
        </ButtonGroup>
      </div>

      <div className="d-flex flex-column bd-highlight mb-3">
        <div className="p-2 bd-highlight" style={{ marginLeft: 10 }}>
          <InputNumber
            defaultValue={30}
            min={0}
            max={100}
            formatter={(value) => `${value} days`}
            parser={(value) => value.replace(" days", "")}
            onChange={onChange}
          />
        </div>

        <div className="p-2 bd-highlight">
          <Select
            mode="multiple"
            placeholder="select your formats"
            style={{ width: 900, margin: 10 }}
            onChange={handleChange}
          >
            <Option value="word">
              <Icon type="file-word" />
              Word
            </Option>
            <Option value="excel">
              <Icon type="file-excel" />
              Excel
            </Option>
            <Option value="pdf">
              <Icon type="file-pdf" />
              Pdf
            </Option>

            <Option value="text">
              <Icon type="file-text" />
              Text
            </Option>
            <Option value="jpeg">
              <Icon type="file-jpg" />
              Jpeg
            </Option>
            <Option value="bitmap">
              <Icon type="file" />
              Bitmap
            </Option>
            <Option value="png">
              <Icon type="file-image" />
              Png
            </Option>
            <Option value="gif">
              <Icon type="file-exclamation" />
              Gif
            </Option>
          </Select>
        </div>
      </div>
    </div>
  );
  return (
    <Portlet>
      <PortletBody>
        <Collapse accordion>
          <Panel header="Super Administrateur" key="1">
            <div>{superAdmin}</div>
          </Panel>
          <Panel header="Administrateur" key="2">
            <div>{admin}</div>
          </Panel>
          <Panel header="Client" key="3">
            <div>{client}</div>
          </Panel>
        </Collapse>
      </PortletBody>
    </Portlet>
  );
}
