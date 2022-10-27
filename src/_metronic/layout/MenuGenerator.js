import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MenuGenerator() {
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    axios
      .get("https://run.mocky.io/v3/91f074c8-b503-406f-94aa-b934a2119c2f")
      .then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    if (!data) return;
    const mapData = data.data.map((datarow) => ({
      title: datarow.fluxname,
      root: true,
      alignement:"left",
      toggle:"click",
      page: datarow.fluxid,
      submenu: [
        {
          title: datarow.pagelists.pagelisttitle,
          page: datarow.pagelists.pagelistid,
        },
        {
            title:datarow.fluxwizard.name,
            page:datarow.fluxwizard.id,
        }
      ],
    }));
    setDataSource(mapData);
  }, [data]);
}
