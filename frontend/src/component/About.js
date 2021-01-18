import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { PieChart } from 'react-minimal-pie-chart';
import Box from '@material-ui/core/Box'

const data = [
  { title: 'One', value: 10, color: '#E38627' },
  { title: 'Two', value: 15, color: '#C13C37' },
  { title: 'Three', value: 20, color: '#6A2135' },
]

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const defaultLabelStyle = {
  fontSize: '5px',
  fontFamily: 'sans-serif',
  fill: 'white'
};

const lineWidth = 60;
function About(props) {
  const { classes } = props;
  const [hover, setHover] = useState(null)

  return (
    <div>
      About page
      <Box>
        <PieChart
          lineWidth={lineWidth}
          radius={30}
          label={({ dataEntry, dataIndex }) => {
            if (hover === dataIndex) {
              return Math.round(dataEntry.percentage) + '%';
            }
            else {
              return dataEntry.title
            }
          }}
          labelStyle={defaultLabelStyle}
          animate
          data={data}
          labelPosition={100 - lineWidth / 2}
          onMouseOver={(_, index) => {
            setHover(index);
          }}
          onMouseOut={() => {
            setHover(undefined);
          }}
        />
      </Box>
    </div>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);