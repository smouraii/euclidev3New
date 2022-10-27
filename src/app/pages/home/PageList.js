import React, { useState } from "react";
import ModalAttachementList from "../../widgets/ModalAttachement";
import { Table, Input, Button, Tag, Icon, Dropdown, Menu, Modal, Tooltip } from "antd";
import QueryBuilder from "../../widgets/QueryBuilder";
import {
  PortletBody,
  Portlet,
  PortletHeader,
} from "../../partials/content/Portlet";
import axios from "axios";
import {
  useParams,
  useHistory,
} from "react-router-dom";
import qs from "qs";

const { CheckableTag } = Tag;

function PageDetails(props) {

  const [detailColumns, setDetailColumns] = useState([]);
  const [detailData, setDetailData] = useState([]);

  const [linkeddatasetColumns, setLinkeddatasetColumns] = useState([]);
  const [linkeddatasetData, setLinkeddatasetData] = useState([]);

  React.useEffect(() => {
    if (!props.detailsConfig || props.detailsConfig.linkeddataset === false) return;
    const mapcolumnsResult = props.detailsConfig.datasetcolumns.map(
      (resultColumn) => ({
        title: resultColumn.title,
        dataIndex: resultColumn.data,
        key: resultColumn.name,
      })
    );
    setLinkeddatasetColumns(mapcolumnsResult);
  }, [props.detailsConfig]);

  React.useEffect(() => {
    if (
      props.detailsConfig !== null &&
      props.sdcid !== null &&
      props.selectedRow !== null
    )
      axios
        .get(
          `${process.env.REACT_APP_HOST}/EuclideV2/api/getList`,
          {
            params: {
              dc: `com.euclide.sdc.${props.detailsConfig.sdcid}`,
              masterdata: props.sdcid,
              masterdata_id: props.selectedRow.id,
            },
            withCredentials: true 
          },
         
        )
        .then((res) => setDetailData(res.data.data.map(data => ({key: data.id,...data}))));
  }, [props.selectedRow.id]);

  React.useEffect(() => {
    if (!props.detailsConfig) return;

    const mapColumnsSample = props.detailsConfig.pagedetailscolumns.map(
      (detailColumn, index) => ({
        title: detailColumn.title,
        dataIndex: detailColumn.data,
        key: detailColumn.name,
      })
    );
    setDetailColumns(mapColumnsSample);
  }, [props.detailsConfig]);

  //Data Results
  React.useEffect(() => {
    if (props.detailsConfig === null || detailData.length == 0) return;
    (async () => {
      const results = await Promise.all(
        detailData.map(async (datarow) => {
          const res = await axios.get(
            `${process.env.REACT_APP_HOST}/EuclideV2/api/getResults`,
            {
                params: {
                  dc: `com.euclide.sdc.${props.detailsConfig.sdcid}`,
                  id:datarow.id,
                },
                withCredentials: true,
              }
          );
          return res.data.map(data => ({key: data.id,...data}));
        })
      );

      setLinkeddatasetData(results);
    })();
  }, [detailData]);

  return (
    <>
      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-dark">
        <PortletBody fit={true}>
          <PortletHeader title={props.detailsConfig.sdcid} />
          <Table
            style={{ backgroundColor: "white", padding: 20 }}
            columns={detailColumns}
            dataSource={detailData}
            pagination={false}
          />
        </PortletBody>
      </Portlet>
      <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-dark">
        <PortletBody fit={true}>
          <PortletHeader title="Results" />
          <Table
            style={{ backgroundColor: "white", padding: 20 }}
            columns={linkeddatasetColumns}
            dataSource={linkeddatasetData}
            pagination={false}
          />
        </PortletBody>
      </Portlet>
    </>
  );
}

export default function PageList() {
  const history = useHistory();
  const { fluxId, pagelistid, masterdataid } = useParams();

  //main Table
  const [fluxConfig, setFluxConfig] = useState(null);
  const [pageConfig, setPageConfig] = useState(null);
  const [relatedWizard, setRelatedWizard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState({ data: [] });

  //data of the row
  const [selectedRow, setSelectedRow] = useState(null);
  const [showQuerybuilder, setShowQuerybuilder] = React.useState(false);

  const { Search } = Input;

  // Retreive page config
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getPageList`, {
        params: {
          pagelistid: pagelistid,
          fluxId: fluxId,
        },
        withCredentials: true,
      })
      .then((res) => {
        setFluxConfig(res.data.flux);
        setRelatedWizard(res.data.flux.fluxwizard.find((wizard) => wizard.id === res.data.pagelist.relatedwizard))
        setPageConfig(res.data.pagelist);
      });
  }, [fluxId, pagelistid]);

  //map columns for generating columns and search and sort and redirect to details
  React.useEffect(() => {
    if (!pageConfig) return;
    const mapColumns = []

    if (
      relatedWizard && 
      relatedWizard.saveAsTemplate && 
      relatedWizard.saveAsTemplateOptions.saveAsTemplateColumn != '' &&
      relatedWizard.saveAsTemplateOptions.saveAsTemplateValue != '') {
      mapColumns.push({
        title: "",
        dataIndex: "",
        key: "favorite",
        fixed: 'left',
        render: (record) => {
          const isTemplate = (
            record[relatedWizard.saveAsTemplateOptions.saveAsTemplateColumn] == relatedWizard.saveAsTemplateOptions.saveAsTemplateValue ||
            record[relatedWizard.saveAsTemplateOptions.saveAsTemplateColumn] == relatedWizard.saveAsTemplateOptions.favoriteTemplateValue
          )
          
          return isTemplate && (
            <Tooltip placement="top" title={(
              record[relatedWizard.saveAsTemplateOptions.saveAsTemplateColumn] == relatedWizard.saveAsTemplateOptions.favoriteTemplateValue ?
                'Undo favorite': 'Make favorite'
            )}>
              <CheckableTag checked={record[relatedWizard.saveAsTemplateOptions.saveAsTemplateColumn] == relatedWizard.saveAsTemplateOptions.favoriteTemplateValue} 
                onChange={(checked) => {
                  axios
                    .post(`${process.env.REACT_APP_HOST}/EuclideV2/api/flux/wizard/favorite`, qs.stringify({
                      flux: fluxId,
                      wizardId: relatedWizard.id,
                      id: record.id,
                      make: checked
                    }))
                    .then((res) => {
                      handleResetSearch();
                    });
                }}><Icon type="star" /></CheckableTag>  
            </Tooltip>)
        }
      })
    }
    
    mapColumns.push({
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
      render: (id, val) => (
        <Button type="link" onClick={() => setSelectedRow(val)}>
          {id}
        </Button>
      )
    });
      
    pageConfig.columns.map((column, index) => mapColumns.push({
      title: column.title,
      dataIndex: column.data,
      key: column.name,
      sorter: (a, b) => {
        if(column.data.split('.').length > 1) {
          const columnData = column.data.split('.');
          return ((a[columnData[0]] && a[columnData[0]][columnData[1]]) || 'N/A').localeCompare(((b[columnData[0]] && b[columnData[0]][columnData[1]]) || 'N/A'))
        } else {
          return (a[column.data] || 'N/A').localeCompare((b[column.data] || 'N/A'))
        }
      },
      render: (data) => (data != null ? data : "N/A"),
    }));

    if (pageConfig.attachment) {
      mapColumns.push({
        title: "Attachement",
        dataIndex: "attachments",
        key: "attachment",
        render: (id, val) => (
          <ModalAttachementList attachments={val.attachments} />
        ),
      })
    }

    if (relatedWizard) {
      mapColumns.push({
        title: "",
        dataIndex: "",
        key: "actions",
        render: (record) => (
          <Dropdown trigger={['click']} overlay={() => (
            <Menu onClick={(e) => {
              if (e.key == 'edit' && !record.editable.iseditable) {
                Modal.warning({
                  content: `The selected ${pageConfig.sdcid} does not meet the following requirements to be edited: ${record.editable.msg}`,
                });
              } else if (e.key == 'edit' && record.editable.iseditable) {
                  history.push(`/wizard/${fluxId}/${relatedWizard.id}/edit/${record.id}`)
              } else if (e.key == 'duplicate') {
                history.push(`/wizard/${fluxId}/${relatedWizard.id}/duplicate/${record.id}`)
              }
            }}>
              <Menu.Item key="edit">
                Edit
              </Menu.Item>
              <Menu.Item key="duplicate">
                Duplicate
              </Menu.Item>
            </Menu>)}>
            <Button size="small">
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        ),
      })
    }
    setColumns(mapColumns);
  }, [pageConfig]);

  React.useEffect(() => {
    if (pageConfig !== null)
      axios
        .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
          params: {
            flux: fluxId,
            pagelist: pagelistid,
            dc: `com.euclide.sdc.${pageConfig.sdcid}`,
            masterdata: pageConfig.sdcid,
            attachments: pageConfig.attachment,
          },
          withCredentials: true,
        })
        .then((res) => setData({...res.data, data: res.data.data.map(data => ({key: data.id,...data}))}));
  }, [columns]);

  React.useEffect(() => {
    if (data.data !== null && masterdataid !== null)
      setSelectedRow(data.data.find((row) => row.id == masterdataid))
  }, [data]);

  //Search Input
  const onSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
        params: {
          dc: `com.euclide.sdc.${pageConfig.sdcid}`,
          masterdata: pageConfig.sdcid,
          attachments: pageConfig.attachment,
          flux: fluxId,
          pagelist: pagelistid,
          "search[value]": value,
        }
      })
      .then((res) => {
        if (masterdataid !==null) {
          history.push(`/list/${fluxId}/${pagelistid}`)
        }
        setResults(res.data)
      });
  };

  const handleResetSearch = () => {

    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getList`, {
        params: {
          dc: `com.euclide.sdc.${pageConfig.sdcid}`,
          masterdata: pageConfig.sdcid,
          attachments: pageConfig.attachment,
        },
        withCredentials: true,
      })
      .then((res) => {
        setResults(res.data)
        setShowQuerybuilder(false);
        setSelectedRow(null);
      });
  }

  const setResults = (data) => {
    if (masterdataid !==null) {
      history.push(`/list/${fluxId}/${pagelistid}`)
    }
    setData({...data, data: data.data.map(data => ({key: data.id,...data}))})
  }

  return (
    
    <>
      <div style={{ marginBottom: 5 }}>
        <div className="col-xl-12">
          <Portlet
            className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
          >
            <PortletBody>
              <div className="row d-flex flex-space-evenly " style={{ margin: 10 }}>
                <div className="col-6">
                  <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    disabled={showQuerybuilder}
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
                      onClick={() => setShowQuerybuilder(!showQuerybuilder)}
                    >
                      Advanced
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <QueryBuilder flux={fluxId} setResults={setResults} pageConfig={pageConfig} visible={showQuerybuilder} setVisible={setShowQuerybuilder}/>
              </div>
            </PortletBody>
          </Portlet>
        </div>
      </div>

      <div className="col-xl-12">
        <Portlet
          className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
        >
          <PortletBody>
            {!selectedRow && (
              <Table
                style={{ backgroundColor: "white" }}
                columns={columns}
                dataSource={data.data}
              />
            )}
            {selectedRow && (
              <>
                <div className="col-xl-12">
                  <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-dark">
                    <PortletBody fit={true}>
                      <PortletHeader title="Details" />
                      <Table
                        style={{ backgroundColor: "white", padding: 20 }}
                        columns={columns}
                        dataSource={[selectedRow]}
                        pagination={false}
                      />
                    </PortletBody>
                  </Portlet>
                </div>
                
                <div className="col-xl-12">
                  {pageConfig.pagedetails.map((detail, index) => (
                    <PageDetails
                      key={detail.sdcid+index}
                      detailsConfig={detail}
                      selectedRow={selectedRow}
                      sdcid={pageConfig.sdcid}
                    />
                  ))}
                </div>
              </>
            )}
          </PortletBody>
        </Portlet>
      </div>
    </>
  );
}
