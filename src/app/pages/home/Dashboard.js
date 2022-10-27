import React, { useState, createContext, useContext } from "react";
import {
  Portlet,
  PortletBody,
  PortletHeader,
} from "../../partials/content/Portlet";
import MyResponsivePie from "../../widgets/PieChart";
import MyResponsiveBar from "../../widgets/BarChart";
import axios from "axios";
import DatePickerComp from "../../widgets/DatePicker";
import moment from 'moment';

const DateRangeContext = createContext({startDate: moment().subtract(1, 'year'), endDate: moment()});

function BarChart({config}) {
  const [data, setData] = useState(null);
  const {startDate, endDate} = useContext(DateRangeContext);
  // API GET CHARTDATA
  React.useEffect(() => {
    if(!config) return;
    axios
    .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/flux/dashboard/charts/histogram`, {
        params: {
          charttitle: config.title.replaceAll(/\s/g,""),
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        },
        withCredentials: true,
      })
      .then((res) => setData(res.data.data));
  }, [config, startDate, endDate])

  return (
    <>
      {data && data.length > 0 && <MyResponsiveBar data={data}/>}
    </>
  )

}

function PieChart({config}) {
  const [data, setData] = useState(null);
  const {startDate, endDate} = useContext(DateRangeContext);

  // API GET CHARTDATA
  React.useEffect(() => {
    if(!config) return;
    axios
    .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/flux/dashboard/charts/pie`, {
        params: {
          charttitle: config.title.replaceAll(/\s/g,""),
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        },
        withCredentials: true,
      })
      .then((res) => setData(res.data.data.map(data => ({id:data.statut,value:data.value}))))
  }, [config, startDate, endDate])

  return (
    <>
    {data && data.length > 0 && <MyResponsivePie data={data}/>}
    </>
  )
}

export default function Dashboard() {
  const [chartConfig, setChartConfig] = useState(null);
  const [dateRange, setDateRange] = useState({startDate: moment().subtract(1, 'year'), endDate: moment()});

  //API GET Charts configuration
  React.useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_HOST}/EuclideV2/api/flux/dashboard/charts`)
      .then((res) => setChartConfig(res.data));
  }, []);

  return (
    <>
      <div className="row d-flex justify-content-center">
        
        <div className="col-xl-12 d-flex justify-content-right">
          <div style={{ margin: 5 }}>
            <DatePickerComp onChangeCallback={setDateRange}/>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="row row-full-height">
          <DateRangeContext.Provider value={dateRange}>
          {chartConfig && chartConfig.map((chart) => (
            <div className="col-sm-12 col-md-12 col-lg-6" key={chart.title}>
                <Portlet
                  className="kt-portlet--height-fluid kt-portlet--border-bottom-dark"
                  fluidHeight={true}
                >
                  <PortletHeader title={chart.title} />
                  <PortletBody>
                    {chart.charttype == 'Histogram' && <BarChart config={chart}/>}
                    {chart.charttype == 'Pie' && <PieChart config={chart}/>}
                  </PortletBody>
                </Portlet>
              </div>
            ))}
            </DateRangeContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}
