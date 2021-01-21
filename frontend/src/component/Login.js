import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { AuthContext } from '../AuthContext'
import agent from '../agent'

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

function Login(props) {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isWaitingAuth, setIsWaitingAuth] = useState(true);
  const { setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsWaiting(true);
    try {
      const body = {
        username: username,
        password: password
      };
      const result = await agent.Auth.login(body);
      setIsWaiting(false);
      if (result.data.success) {
        setCurrentUser({ username: username, isLogin: true, isTokenValid: true });
        history.push('/');
      } else {
        alert(result.data.error);
      }
    } catch (err) {
      setIsWaiting(false);
      alert(err)
    }
  }

  const checkAuth = async () => {
    if (!window.localStorage.getItem('jwt')) {
      setIsWaitingAuth(false);
      return;
    }
    try {
      let result = await agent.Auth.authorization();
      if (result.data.success) {
        setCurrentUser({ username: result.data.data.username, isLogin: true, isTokenValid: true });
        history.push('/');
      }
      setIsWaitingAuth(false);
    } catch (e) {
      setCurrentUser(null);
      setIsWaitingAuth(false);
      alert(e);
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div id="page-login" className="container">
      {!isWaitingAuth &&
        <form onSubmit={handleSubmit}>
          <Paper className={classes.paper}>
            <Box id="page-login__wrapper" p={6}>
              <Box my={2}>
                <Typography variant="h3">Login</Typography>
              </Box>
              <TextField
                label="帳號"
                fullWidth
                placeholder="請輸入您的帳號"
                margin="normal"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="密碼"
                fullWidth
                placeholder="請輸入您的密碼"
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
                  登入
                </Button>
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => {
                    history.push('/register')
                  }}>
                  新增帳號
                </Button>
              </Box>
            </Box>
          </Paper>
        </form>
      }
      <Backdrop className={classes.backdrop} open={isWaiting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default Login
