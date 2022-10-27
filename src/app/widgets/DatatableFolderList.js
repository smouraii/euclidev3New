import React, { useRef, useState } from "react";
import { Table, Input, Button, Icon, DatePicker } from "antd";
import { withRouter } from "react-router-dom";
import QueryBuilder from "./QueryBuilder";
import Highlighter from "react-highlight-words";
import {
  PortletBody,
  Portlet,
  PortletHeader,
} from "../partials/content/Portlet";
import ModalAttachementList from "./ModalAttachement";
import axios from "axios";
import queryString from "query-string";
import PageDetails from "./PageDetails";

function Datatable(props) {
  //parsed
  const [parsed, setParsed] = useState(
    queryString.parse(props.location.search)
  );
  //main Table
  const [columnsApi, setColumnsApi] = useState([]);
  const [columnsData, setColumnsData] = useState(null);
  const [data, setData] = useState({ data: [] });
  const [dataSource, setDataSource] = useState(null);

  //Table's functionality
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchColumn] = useState("");
  //data of the row
  const [selectedRow, setSelectedRow] = useState(null);

  const [columnsId, setColumnsId] = useState(null);

  const [showQuerybuilder, setShowQuerybuilder] = React.useState(false);

  const { Search } = Input;

  // API for Columns generation
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getPageList`, {
        params: {
          pagelistid: parsed.pagelistid,
          fluxId: parsed.fluxId,
        },
        withCredentials: true,
      })
      .then((res) => setColumnsData(res.data));
    console.log("parsed", parsed);
    console.log("props", props);
    console.log("columnsData", columnsData);

    //API for Data in Datatable
  }, [parsed]);

  React.useEffect(() => {
    if (columnsData !== null)
      axios
        .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
          params: {
            dc: `com.euclide.sdc.${columnsData.sdcid}`,
            masterdata: columnsData.sdcid,
            attachments: columnsData.attachment,
          },
          withCredentials: true,
        })
        .then((res) => setData(res.data));
  }, [columnsData]);

  React.useEffect(() => {
    console.log("Alldata", data);
  }, [data]);

  React.useEffect(() => {
    if (!selectedRow) return;
    console.log("selectedRow", selectedRow);
  }, [selectedRow]);

  //Search Input
  const onSearch = (value) =>{
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
        params: {
          dc: `com.euclide.sdc.${columnsData.sdcid}`,
          masterdata: columnsData.sdcid,
          attachments: columnsData.attachment,
          flux: parsed.fluxId,
          pagelist: parsed.pagelistid,
          "search[value]": value,
        }
      })
      .then((res) => setData(res.data));
  };

  const handleClick = () => setShowQuerybuilder(!showQuerybuilder);

  const handleResetSearch = () =>
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
        params: {
          dc: `com.euclide.sdc.${columnsData.sdcid}`,
          masterdata: columnsData.sdcid,
          attachments: columnsData.attachment,
        },
        withCredentials: true,
      })
      .then((res) => setData(res.data),setSelectedRow(null));

  //Table
  const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager);
  };

  const searchInput = useRef(null);

  //Search Function for text Areas
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys, confirm, dataIndex.first)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex.first)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <Icon type="search" style={{ marginBottom: 10 }} />
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

console.log("columnsData",columnsData);
  //map columns for generating columns and search and sort and redirect to details
  React.useEffect(() => {
    if (!columnsData) return;
    const mapColumns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
        render: (id, val) => (
          <Button type="link" onClick={() => setSelectedRow(val)}>
            {id}
          </Button>
        ),
      },
      ...columnsData.pagelist.columns.map((column, index) => ({
        title: column.title,
        dataIndex: column.data,
        key: column.name,
        ...getColumnSearchProps(column.data),
        sorter: (a, b) => {
          console.log("a1", a, "b1", b);
          console.log("a", a[column.data], "b", b[column.data]);
          return a[column.data] !== null
            ? a[column.data].localeCompare(b[column.data])
            : a[column.data] - b[column.data];
        },
        render: (data) => (data != null ? data : "N/A"),
      })),
      
    ];
    if (columnsData.attachment) {
      mapColumns.push({
        title: "Attachement",
        dataIndex: "test",
        key: "test",
        render: (id, val) => (
          <ModalAttachementList recordId={[val.attachments]} />
        ),
      })
    }
    setColumnsApi(mapColumns);
    console.log("selectedRow", selectedRow);
    console.log("mapColumns", mapColumns);
  }, [columnsData, selectedRow]);

  React.useEffect(() => {
    console.log("columnsApi", columnsApi);
  }, [columnsApi]);

  return (
    <>
      <div className="row d-flex flex-space-evenly " style={{ margin: 10 }}>
        <div className="col-6">
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </div>
        <div className="row d-flex flex-space-around col-6">
          <div className="col-6">
            <Button
              size={"large"}
              style={{ width: "100%" }}
              onClick={handleResetSearch}
            >
              Reset Search
            </Button>
          </div>
          <div className="col-6">
            <Button
              size={"large"}
              style={{ width: "100%" }}
              onClick={handleClick}
            >
              Advanced
            </Button>
          </div>
        </div>
      </div>
      <div className="col-12">
        {showQuerybuilder ? <QueryBuilder columnsData={columnsData} /> : null}
      </div>

      {!selectedRow && (
        <Table
          style={{ backgroundColor: "white" }}
          columns={columnsApi}
          dataSource={data.data}
        />
      )}
      {selectedRow && (
        <div className="row row-no-padding row-col-separator-x1">
          <div className="col-xl-12">
            <Portlet>
              <PortletBody fit={true}>
                <PortletHeader title="Details" />
                <Table
                  style={{ backgroundColor: "white", padding: 20 }}
                  columns={columnsApi}
                  dataSource={[selectedRow]}
                  // pagination={pagination}
                  onChange={handleTableChange}
                />
              </PortletBody>
            </Portlet>
            {columnsData.pagedetails.map((detail) => (
              <PageDetails
                detail={detail}
                selectedRow={selectedRow}
                sdcid={columnsData.sdcid}
              />
            ))}
          </div>
        </div>
      )}

      {console.log(dataSource)}
    </>
  );
}

export default withRouter(Datatable);
