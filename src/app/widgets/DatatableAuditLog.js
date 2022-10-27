import React from "react";
import { Table, Input, Button, Icon, Pagination, Checkbox } from "antd";
import reqwest from "reqwest";
import { withRouter } from "react-router-dom";
import QueryBuilder from "./QueryBuilder";
import Highlighter from "react-highlight-words";
import Search from "antd/lib/input/Search";

class DatatableAuditLog extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
    searchText: "",
    searchedColumn: "",
  };

  //   componentDidMount() {
  //     this.fetch();
  //   }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters
    // });
  };

  //   fetch = (params = {}) => {

  //     this.setState({ loading: true });
  //     reqwest({
  //       url: "https://randomuser.me/api",
  //       method: "get",
  //       data: {
  //         results: 10,
  //         ...params
  //       },
  //       type: "json"
  //     }).then(data => {
  //       console.log(data)
  //       const mapData = data.results.map(user=>{
  //         return{
  //           ...user,
  //           name:`${user.name.first} ${user.name.last}`,
  //           location:`${user.location.country} ${user.location.state}`
  //         }
  //       })
  //       const pagination = { ...this.state.pagination };
  //       // Read total count from server
  //       // pagination.total = data.totalCount;
  //       pagination.total = 200;
  //       this.setState({
  //         loading: false,
  //         data: mapData,
  //         pagination
  //       });

  //     });
  //   };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        {console.log(dataIndex)}
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex.first)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex.first)
          }
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <Icon type="search" style={{ marginBottom: 10 }} />
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
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
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onShowSizeChange = (current, pageSizeOptions) => {
    this.setState({ pageSizeOptions });
    console.log(current, pageSizeOptions);
  };

  render() {
    const columns = [
      {
        title: "date",
        dataIndex: "date",
        key: "date",
        sorter: (a, b) => a.dob.date - b.dob.date,
        ...this.getColumnSearchProps("date"),
      },
      {
        title: "activity",
        dataIndex: "activity",
        key: "activity",
        defaultSortOrder: "descend",
        //dob is date of birth from api
        render: (dob) => `${dob.activity}`,
        //a b used to sort from big to small
        sorter: (a, b) => a.activity.localeCompare(b.activity),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
        filters: [
          { text: "Male", value: "male" },
          { text: "Female", value: "female" },
        ],
      },
      {
        title: "User",
        dataIndex: "user",
        key: "user",
        sorter: (a, b) => a.user.localeCompare(b.user),
        ...this.getColumnSearchProps("user"),
      },
    ];

    return (
      <>
        {this.props.match.path === "/folderlist" && (
          <>
            {" "}
            <div className="d-flex justify-content-end">
              {/* <Search
      placeholder="input search text"
      onSearch={value => console.log(value)}
      style={{ width: 200 ,margin:20}}
    /> */}
            </div>
            <QueryBuilder data={this.state.data} />
          </>
        )}
        {/* <Pagination
        pagination={this.state.pagination}
      showSizeChanger
      onShowSizeChange={this.onShowSizeChange}
      top

    /> */}
        <Table
          columns={columns}
          rowKey={(record) => record.login.uuid}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />

        {console.log(this)}
      </>
    );
  }
}
export default withRouter(DatatableAuditLog);
