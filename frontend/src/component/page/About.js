import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  contributor: {
    position: 'fixed',
    bottom: '20%'
  },
  link: {
    display: 'flex',
    alignItem: 'center'
  }
});


function About(props) {
  const { classes } = props;

  return (
    <div>
      <Typography variant="h4">
        NTUEE Web Programming 109-1 Final Project
        </Typography>
      <Box className={classes.contributor}>
        <Typography>
          Contributor：
        </Typography>
        <Box style={{ display: 'flex' }}>
          <Box m={2}>
            <Typography>
              電機三 陳俊廷
              </Typography>
            <Box className={classes.link}>
              <GitHubIcon fontSize="small" />&nbsp;&nbsp;
                <Link
                color="inherit"
                rel="noreferrer"
                target="_blank"
                href="https://github.com/Jim-CTChen"
              >
                <Typography>Jim-CTChen</Typography>
              </Link>
            </Box>
            <Box className={classes.link}>
              <FacebookIcon fontSize="small" />&nbsp;&nbsp;
                <Link
                color="inherit"
                rel="noreferrer"
                target="_blank"
                href="https://www.facebook.com/chen.j.ting.902/"
              >
                <Typography>陳俊廷</Typography>
              </Link>
            </Box>
          </Box>
          <Box m={2}>
            <Typography>
              電機三 高偉堯
              </Typography>
            <Box className={classes.link}>
              <GitHubIcon fontSize="small" />&nbsp;&nbsp;
                <Link
                color="inherit"
                rel="noreferrer"
                target="_blank"
                href="https://github.com/KaoWYK"
              >
                <Typography>KaoWYK</Typography>
              </Link>
            </Box>
            <Box className={classes.link}>
              <FacebookIcon fontSize="small" />&nbsp;&nbsp;
                <Link
                color="inherit"
                rel="noreferrer"
                target="_blank"
                href="https://www.facebook.com/profile.php?id=100006138060840"
              >
                <Typography>高偉堯</Typography>
              </Link>
            </Box>
          </Box>

        </Box>
      </Box>
    </div>
  );
}

export default withStyles(styles)(About);