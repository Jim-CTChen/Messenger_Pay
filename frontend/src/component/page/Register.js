import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../AuthContext';
import agent from '../../agent';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '60%',
    margin: '10% auto'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  button: {
    marginRight: theme.spacing(1)
  }
}))

function Register(props) {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsWaiting(true);
    try {
      const body = {
        username: username,
        password: password,
        name: username
      };
      const result = await agent.User.createUser(body);
      setIsWaiting(false);
      if (result.data.success) {
        await agent.Auth.login({
          username: username,
          password: password
        })
        setCurrentUser({ username: username, isLogin: true, isTokenValid: true });
        history.push('/');
      } else {
        alert(result.data.error);
      }
    } catch (err) {
      setIsWaiting(false);
    }
  }

  return (
    <div id="page-login" className="container">
      <form onSubmit={handleSubmit}>
        <Paper className={classes.paper}>
          <Box id="page-login__wrapper" p={6}>
            <Box my={2}>
              <Typography variant="h3">Register</Typography>
            </Box>
            <TextField
              label="帳號"
              fullWidth
              placeholder="請輸入帳號"
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="密碼"
              fullWidth
              placeholder="請輸入密碼"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              InputLabelProps={{ shrink: true }}
            />
            <Box mt={7}>
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                size="large">
                新增帳號
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={() => {
                  history.push('/login')
                }}>
                返回登入
              </Button>
            </Box>
          </Box>
        </Paper>
      </form>
      <Backdrop className={classes.backdrop} open={isWaiting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default Register
