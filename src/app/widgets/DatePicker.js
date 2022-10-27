import React, { useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default function DatePickerComp({onChangeCallback}){
  const [startDate, setStartDate] = useState(moment().subtract(1, 'year'));
  const [endDate, setEndDate] = useState(moment());

  function onChange(dates, dateStrings) {
    setStartDate(dates[0])
    setEndDate(dates[1])
  }

  //API GET Charts configuration
  React.useEffect(() => {
    onChangeCallback({startDate,endDate})
  }, [startDate, endDate]);

  return(
    <div>
      <RangePicker
        allowClear={false}
        ranges={{
          Today: [moment(), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        }}
        value={[startDate,endDate]}
        onChange={onChange}
      />
    </div>
  );
}