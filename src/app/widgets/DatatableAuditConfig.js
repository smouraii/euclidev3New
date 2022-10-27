import React from "react";
import { Table, Divider, Tag, Switch } from "antd";

export default function DatatableAuditConfig() {
  const columns = [
    {
      title: "Propertie",
      dataIndex: "propertie",
      key: "propertie",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Switch />
        </span>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      propertie: "content-type",
     },
     {
        key: "2",
        propertie: "issue",
       },
       {
        key: "3",
        propertie: "folder",
       },
       {
        key: "4",
        propertie: "alias",
       },
       {
        key: "5",
        propertie: "newFileName",
       },
       {
        key: "6",
        propertie: "fileExtention",
       },
       {
        key: "7",
        propertie: "members",
       },
       {
        key: "8",
        propertie: "thumbnailFile",
       },
                   
  ];
  return <Table columns={columns} dataSource={data} />;
}
