import React, { useEffect, useState }  from "react";
import {
  Query,
  Builder,
  BasicConfig,
  Utils as QbUtils,
} from "react-awesome-query-builder";
import { Modal, Button, Input, Menu, Dropdown } from "antd";
import axios from "axios";
import qs from "qs";
import SelectQuery from "./SelectQuery";

const defaultConfig = {
  ...BasicConfig,
  settings: {
    ...BasicConfig.settings,
    showNot: false,
  },
  fields: {},
  operators: {
    ...BasicConfig.operators,
    equal: {
      ...BasicConfig.operators.equal,
      label: 'equal',
    },
    not_equal: {
      ...BasicConfig.operators.not_equal,
        label: 'not_equal',
    },
    less: {
      ...BasicConfig.operators.less,
      label: 'less',
    },
    less_or_equal: {
      ...BasicConfig.operators.less_or_equal,
      label: 'less_or_equal',
    },
    greater: {
      ...BasicConfig.operators.greater,
      label: 'greater',
    },
    greater_or_equal: {
      ...BasicConfig.operators.greater_or_equal,
      label: 'greater_or_equal',
    },
    like: {
      ...BasicConfig.operators.like,
      label: 'like',
    },
    not_like: {
      ...BasicConfig.operators.not_like,
      label: 'not_like',
    },
    between: {
      ...BasicConfig.operators.between,
      label: 'between',
    },
    not_between: {
      ...BasicConfig.operators.not_between,
      label: 'not_between',
    },
    range_between: {
      ...BasicConfig.operators.range_between,
      label: 'range_between',
    },
    range_not_between: {
      ...BasicConfig.operators.range_between,
      label: 'range_between',
    },
    is_empty: {
      ...BasicConfig.operators.is_empty,
      label: 'is_empty',
    },
    is_not_empty: {
      ...BasicConfig.operators.is_not_empty,
      label: 'is_not_empty',
    },
    select_equals: {
      ...BasicConfig.operators.select_equals,
      label: 'select_equals',
    },
    select_not_equals: {
      ...BasicConfig.operators.select_not_equals,
      label: 'select_not_equals',
    },
    select_any_in: {
      ...BasicConfig.operators.select_any_in,
      label: 'select_any_in',
    },
    select_not_any_in: {
      ...BasicConfig.operators.select_not_any_in,
      label: 'select_not_any_in',
    },
    multiselect_equals: {
      ...BasicConfig.operators.multiselect_equals,
      label: 'multiselect_equals',
    },
    multiselect_not_equals: {
      ...BasicConfig.operators.multiselect_not_equals,
      label: 'multiselect_not_equals',
    },
    proximity: {
      ...BasicConfig.operators.proximity,
      label: 'proximity',
    },
    begins_with: {
      label: 'begins_with',
    },
    not_begins_with: {
      label: 'not_begins_with',
    },
    contains: {
      label: 'contains',
    },
    not_contains: {
      label: 'not_contains',
    },
    ends_with: {
      label: 'ends_with',
    },
    not_ends_with: {
      label: 'not_ends_with',
    },
    is_null: {
      label: 'is_null',
    },
    is_not_null: {
      label: 'is_not_null',
    },
  },
  widgets: {
    ...BasicConfig.widgets,
    selectQuery: {
      ...BasicConfig.widgets.select,
      type: "selectQuery",
      factory: ({
        value,
        setValue,
        allowCustomValues,
        placeholder,
        customProps,
        ...restProps
      }) => {
        const onChange = (data) => {
          setValue(data);
        };
        return (
          <SelectQuery
            placeholder="Select value"
            selectedValue={value}
            onChange={onChange}
            customProps={customProps}
          />
        );
      },
    },
  },
  types: {
    ...BasicConfig.types,
    text: {
      ...BasicConfig.types.text,
      defaultOperator: "equal",
      widgets: {
        text: {
          ...BasicConfig.types.select.widgets.text,
          operators: [
            'equal',
            'not_equal',
            'is_empty',
            'is_not_empty',
            'contains',
            'not_contains',
            'begins_with',
            'not_begins_with',
            'ends_with',
            'not_ends_with',
            'is_empty',
            'is_not_empty',
            'is_null',
            'is_not_null',
          ],
        },
      },
    },
    select: {
      ...BasicConfig.types.select,
      defaultOperator: "equal",
      widgets: {
        select: {
          ...BasicConfig.types.select.widgets.select,
          operators: ["equal", "not_equal"],
        },
      },
    },
    selectQuery: {
      // valueSources: ["value", "field", "func"],
      defaultOperator: "equal",
      widgets: {
        selectQuery: {
          operators: ["equal", "not_equal"],
        },
      },
    },
  },
};

export default function QueryBuilder(props) {

  const [config, setConfig] = useState(defaultConfig);
  const [tree, setTree ] = useState(QbUtils.checkTree(QbUtils.loadTree({ id: QbUtils.uuid(), type: "group" }), config));
  const [queryName, setQueryName] = useState("");
  const [addQueryVisible, setAddQueryVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [queryData, setQueryData] = useState([]);
  const [visibleQueryDelete, setVisibleQueryDelete] = useState(false);
  const [flux, setFlux] = useState(props.flux);

  //function to call data in QueryBuilder
  const getType = (elem) => {
    if (elem.type === "String") {
      return "text";
    } else if (elem.type === "Number") {
      return "number";
    } else if (elem.type === "Date") {
      return "date";
    } else if (elem.association.hasAssociation && elem.association.values) {
      return "select";
    } else if (elem.association.hasAssociation && !elem.association.values) {
      return "selectQuery";
    } else {
      return elem.type;
    }
  };

  //GetSavedQuery
  const getQuery = () => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder?domain=com.euclide.sdc.${props.pageConfig.sdcid}&pagelist=${props.pageConfig.pagelistid}`,
      )
      .then((res) => {
        setQueryData(res.data.map(data => ({key:data.id, ...data})));
      });
  }

  React.useEffect(() => {
    setFlux(props.flux)
  }, [props.flux]);

  React.useEffect(() => {

    if(!props.pageConfig) return;

    getQuery();

    const convertedColumnsData = props.pageConfig.columns.reduce((fields, elem) => {
      return {
        ...fields,
        [elem.name]: {
          label: elem.title,
          type: getType(elem),
          widgets:
            getType(elem) === "selectQuery"
              ? {
                  selectQuery: {
                    widgetProps: {
                      customProps: {
                        package: elem.association.package,
                        domain: elem.association.domain,
                        displayValue: elem.association.displayValue,
                      },
                    },
                  },
                }
              : null,
          valueSources: ["value"],
          fieldSettings:
            elem.association.hasAssociation ? 
              {
                data: elem.association,
                listValues: elem.association.values ? elem.association.values.map((val) => ({
                  value: val.defaultvalue,
                  title: val.defaultvalue,
                })) : null,
              } : elem.type === "Date" ? 
              {
                dateFormat: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DD hh:mm:ss"
              } : null,
        },
      };
    }, {});
    
    setConfig({
      ...config,
      fields: {
        ...convertedColumnsData,
      },
    });

  }, [props.pageConfig]);

  React.useEffect(() => {
    if (!props.visible) {
      resetQuery();
      setSelectedItem(null);
    }
  }, [props.visible]);
  
  const renderBuilder = (props) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder ">
        <Builder {...props} />
      </div>
    </div>
  );

  const formatRules = (immutableTree, config) => {
    const formatedRules = QbUtils.queryBuilderFormat(immutableTree, config)
    if (formatedRules.rules) {
      generateRule(formatedRules.rules)
    }
    return formatedRules
  }

  const generateRule = (rules) => {
    return rules.map((rule) => {
      if (rule.condition) {
        return generateRule(rule.rules)
      } else {
        const columnConfig = props.pageConfig.columns.find(column => column.name === rule.fieldName)
        if (columnConfig.association.hasAssociation) {
          rule.data = columnConfig.association
        }
        rule.id = rule.fieldName
        rule.field = rule.fieldName
        rule.value = rule.values.map(item => item.value).join()
        if (rule.operator.includes('select_equals')) {
          rule.operator = rule.operator.replace('select_equals','equal')
        }
        return rule
      }
    })
  }

  const formatTree = (rule) => {
    return {
      id: QbUtils.uuid(), 
      type: "group",
      children1: rule.condition ? generateTree(rule.rules) : null,
      properties: {
          conjunction: rule.condition
      }
    }
  }

  const generateTree = (rules) => {
    return rules.reduce((tree, rule) => {
      if (rule.condition) {
        return {
          ...tree,
          [QbUtils.uuid()]: {
            type: "group",
            properties: {
                conjunction: rule.condition
            },
            children1: generateTree(rule.rules),
          }
        }
      } else {
        const columnConfig = props.pageConfig.columns.find(column => column.name === rule.field)

        return {
          ...tree,
          [QbUtils.uuid()]: {
            type: "rule",
            properties: {
              field: rule.field,
              operator: rule.operator,
              value: rule.values ? 
                rule.values.map((item) => item.value)
                : typeof rule.value == 'string' ?
                [rule.value] 
                : typeof rule.value == 'array' ? rule.value
                : null,
              valueSrc: rule.values ? 
                rule.values.map(() => "value")
                : typeof rule.value == 'string' ?
                ["value"] 
                : typeof rule.value == 'array' ? rule.value.map(() => "value")
                : null,
              valueType: [
                getType(columnConfig)
              ]
            }
          }
        }
      }
    }, {})
  }

  const setSearchResultData = (res) => {
    props.setResults(res.data)
  }

  const onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setTree(immutableTree);
    setConfig(config);
  };

  const resetQuery = () => setTree(QbUtils.checkTree(QbUtils.loadTree({ id: QbUtils.uuid(), type: "group" }), config))

  return (
    <>
      <div className="query-builder-result" style={{ padding: "10px" }}>
        {queryData &&
          queryData.map((elem) => (
            <Dropdown
              key={elem.name}
              style={{ marginRight: 10 }}
              onDropDownChange={() => console.log(elem)}
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      if (!props.visible) {
                        props.setVisible(true)
                      }
                      setTree(QbUtils.loadTree(formatTree(JSON.parse(elem.rules)), config));
                      setSelectedItem({"name":elem.name,"id":elem.id});
                    }}
                    key="edit"
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item 
                    onClick={() => {
                      setSelectedItem({"name":elem.name,"id":elem.id});
                      setVisibleQueryDelete(true)
                    }} 
                    key="delete"
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>{
                      if (!props.visible) {
                        props.setVisible(true)
                      }
                      setTree(QbUtils.loadTree(formatTree(JSON.parse(elem.rules)), config));
                      setSelectedItem(null);
                    }}
                    key="copy"
                  >
                    Create a copy from this query
                  </Menu.Item>
                </Menu>
              }
              trigger={["contextMenu"]}
            >
              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  axios
                    .get(
                      `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder/search`,
                      {
                        params: {
                          flux: flux,
                          domain: `com.euclide.sdc.${props.pageConfig.sdcid}`,
                          pagelist: `${props.pageConfig.pagelistid}`,                        
                          savedQueryId:elem.id,
                          attachment: props.pageConfig.attachment
                        }                  
                      },
                    )
                    .then(setSearchResultData)
                    .catch(function(error) {
                      console.log(error);
                    });
                }}
              >
                {elem.name}
              </Button>
            </Dropdown>
          ))}
      </div>
      { props.visible && <>
        <Query
          {...config}
          value={tree}
          onChange={onChange}
          renderBuilder={renderBuilder}
        />
        <div style={{ padding: "10px" }}>
          <Button
            type="primary" 
            style={{marginRight: 10}}
            onClick={() => {
              axios
                .get(
                  `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder/search`,
                  {
                    params: {
                      flux: flux,
                      domain: `com.euclide.sdc.${props.pageConfig.sdcid}`,
                      pagelist: `${props.pageConfig.pagelistid}`,
                      query: JSON.stringify(formatRules(tree, config)),
                      name: queryName,
                      attachment: props.pageConfig.attachment
                    }
                  },
                )
                .then(setSearchResultData)
                .catch(function(error) {
                  console.log("error", error);
                });
            }}
          >
            Lancer la requete
          </Button>
          {selectedItem ? (
            <>
              <Button
                style={{marginRight: 10}}
                onClick={() => {
                  setSelectedItem(null);
                  resetQuery();
                }}
              >
                Cancel
              </Button>
              <Button
                style={{marginRight: 10}}
                onClick={() => {                
                  axios
                    .post(
                      `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder`,
                      {
                        domain: `com.euclide.sdc.${props.pageConfig.sdcid}`,
                        pagelist: `${props.pageConfig.pagelistid}`,
                        rules: formatRules(tree, config),
                        name: selectedItem.name,
                        id: selectedItem.id,
                      },
                      {
                        headers: {
                          "content-type": "application/json",
                        },
                      }
                    )
                    .then((response) => {
                      if (response.statusText == "OK") {
                        getQuery();
                        setSelectedItem(null);
                        resetQuery();
                      }
                    })
                    .catch(function(error) {
                      console.log("error", error);
                    });
                }}
              >
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button style={{marginRight: 10}} onClick={() => setAddQueryVisible(true)}>
                Save
              </Button>
            </>
          )}

          
        </div>
      </>}
      <Modal
        title="Add a new Query"
        visible={addQueryVisible}
        onOk={() => {
          axios
            .post(
              `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder`,
              {
                domain: `com.euclide.sdc.${props.pageConfig.sdcid}`,
                pagelist: `${props.pageConfig.pagelistid}`,
                rules: formatRules(tree, config),
                name: queryName,
              },
              {
                headers: {
                  "content-type": "application/json",
                },
              }
            )
            .then((response) => {
              if (response.statusText == "OK") {
                getQuery();
                setAddQueryVisible(false);
                setQueryName("");
                resetQuery();
              }
            })
            .catch(function(error) {
              console.log("error", error);
            });
        }}
        onCancel={() => {
          setAddQueryVisible(false);
          setQueryName("");
        }}
      >
        <Input placeholder="name" value={queryName} onChange={({ target: { value } }) => setQueryName(value)} />
      </Modal>
      <Modal
        title="Delete a Query"
        visible={visibleQueryDelete}
        onOk={() => {
          axios
            .delete(
              `${process.env.REACT_APP_HOST}/EuclideV2/api/querybuilder?id=${selectedItem.id}`,
            )
            .then((response) => {
              if (response.statusText == "OK") {
                getQuery();
                setVisibleQueryDelete(false);
              }
            });
            setSelectedItem(null);
        }}
        onCancel={() => {
          setVisibleQueryDelete(false)
          setSelectedItem(null);
        }}
      >
        <p>Do you really want to delete this Query</p>
      </Modal>
    </>
  );

}
