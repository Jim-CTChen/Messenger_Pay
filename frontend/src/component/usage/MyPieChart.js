import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Box from '@material-ui/core/Box';
import constants from '../../constants/index'

const colorArray = constants.COLOR_ARRAY;

const defaultLabelStyle = {
  fontSize: '5px',
  fontFamily: 'sans-serif',
  fill: 'white'
};

const lineWidth = 60;

function MyPieChart(props) {
  const { data } = props;
  const [hover, setHover] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data) setChartData(null);
    else {
      const newData = data.map((ele, idx) => {
        return {
          ...ele,
          color: colorArray[idx]
        }
      })
      setChartData(newData)
    }
  }, [data])

  return (
    <Box>
      {chartData &&
        <PieChart
          lineWidth={lineWidth}
          radius={40}
          label={({ dataEntry, dataIndex }) => {
            if (hover === dataIndex) {
              return dataEntry.value + `${dataEntry.unit}`
            }
            else {
              return dataEntry.title
            }
          }}
          labelStyle={defaultLabelStyle}
          animate
          animationDuration={500}
          data={chartData}
          labelPosition={100 - lineWidth / 2}
          onMouseOver={(_, index) => {
            setHover(index);
          }}
          onMouseOut={() => {
            setHover(undefined);
          }}
        />
      }
    </Box>
  )
}

export default MyPieChart;