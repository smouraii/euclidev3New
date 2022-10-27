import React, { useLayoutEffect, useRef, useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Select, message, Spin, Typography } from "antd";
import axios from "axios";
import useSWR from "swr";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
const { Text } = Typography;

function FSelect(props) {
  const [data, setData] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [selectedItem,setSelectedItem]= useState([])
  const [scrollPosition, setScrollPosition] = useState(window.pageYOffset);
  const parsed = queryString.parse(props.location.search);
  //setHasMore to false set page 0 set data null on closing dropdown

  const { setFieldValue, values } = useFormikContext();

  function onSearch(val) {
    setFilter(val);
    setPage(0);
  }



  const morePage = () => {
    setPage(page + 1);
  };


  React.useEffect(() => {
    if (props === null) return;
    axios
      .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/getSelectOptions`, {
        params: {
          dc: `com.euclide.sdc.${props.refsdcid}`,
          display: props.display,
          flux: parsed.fluxId,
          wizard: parsed.pagelistid,
          step: props.step,
          field: props.name,
          page: page,
          filter: filter,
        },
      })
      .then((response) => {
        page === 0
          ? setData(response.data.results)
          : setData([...data, ...response.data.results]);
        setHasMore(response.data.more);
        setLoading(false);
      });
  }, [props, page]);

  React.useEffect(() => {
    if (!props.templateData) return;
    setData([props.templateData]);
  }, [props.templateData]);

  return (
    <>
      {data && (
        <div className="inputContainer">
          <label htmlFor={props.name}>{props.label}</label>
          <Field
            showSearch
            component={Select}
            onChange={(val) => (values[props.name] = val)}
            onSelect={(val) => setFieldValue(props.name, val)}
            name={props.name}
            placeholder={props.label}
            value={
              Array.isArray(values[props.step])
                ? values[props.step][props.valueIndex][props.field]
                : values[props.name]
            }
            disabled={props.readonly}
            hidden={props.hidden}
            onSearch={onSearch}
            style={{ width: "100%" }}
            onPopupScroll={(element, useWindow) => {
              //try to fix this with native JS or a library if i fail to
              if (
                hasMore !== false &&
                window.innerHeight + document.documentElement.scrollTop ===
                  document.scrollingElement.scrollHeight
              ) {
                setPage(page + 1);
              }
            }}
          >
            {data.map((elem) => (
              <Select.Option key={elem.id} value={elem.id}>
                <div className="demo-infinite-container">{elem.name}</div>
              </Select.Option>
            ))}
          </Field>
          <p style={{ margin: 0 }}>{props.instructionaltext}</p>
          <ErrorMessage
            name={props.name}
            render={(msg) => <Text type="danger">{msg}</Text>}
          />
        </div>
      )}
    </>
  );
}

export default withRouter(FSelect);
