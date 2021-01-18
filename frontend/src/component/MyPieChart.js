import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Box from '@material-ui/core/Box';



var colorArray = ['#E38627', '#C13C37', '#6A2135', '#cf3c88', '#d70c7e', '#b7b82d',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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