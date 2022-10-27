import React, { useState } from "react";
import { Table } from "antd";
import useSWR from "swr";

export default function DatatableTest() {
  const [columnsApi,setColumnsApi] =useState(null)
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  // const { data, error } = useSWR(
  //   "https://run.mocky.io/v3/49335da3-1de5-40b9-83f5-464140dff9be",
  //   fetcher
  //   // `http://localhost:8088/EuclideV2/api/getSelectOptions?dc=com.euclide.sdc.RequestStatus&display=${props.display}`
  // );
  // React.useEffect(() => {
  //   // console.log("props", props);
  //   // axios
  //   //   .get(
  //   //     `http://localhost:8088/EuclideV2/api/getSelectOptions?dc=com.euclide.sdc.RequestStatus&display=${display}`
  //   //   )
  //   //   .then((res) => setData(res.data));

  //   console.log("data", data);
  //   console.log("error", error);
  // }, [data, error]);

  const data = [
    {
      key: "1",
      propertie: "content-type"
    },
    {
      key: "2",
      propertie: "issue"
    },
    {
      key: "3",
      propertie: "folder"
    },
    {
      key: "4",
      propertie: "alias"
    },
    {
      key: "5",
      propertie: "newFileName"
    },
    {
      key: "6",
      propertie: "fileExtention"
    },
    {
      key: "7",
      propertie: "members"
    },
    {
      key: "8",
      propertie: "thumbnailFile"
    }
  ];

  const { columnsData } = useSWR(
    "https://run.mocky.io/v3/86b418dc-085b-415d-8c2d-bee469ac5b82",
    fetcher
  );
  React.useEffect(() => {
    const columnsApi = columnsData.map((column) => [
    { title: column.title, dataIndex: column.data }
  ]);
    console.log("data", columnsData);
  }, [columnsData]);

  
  return <>{columnsApi && <Table columns={columnsApi} dataSource={data} />}</>;
}
