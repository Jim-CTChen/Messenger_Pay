import { Route, Switch } from 'react-router-dom'
import './App.css';
import AuthContext from './AuthContext'
import Full from './container/Full'
import Login from './component/Login'
import Register from './component/Register'

function App() {
  return (
    <AuthContext>
      <Switch>
        <Route path="/login" name="login" component={Login} />
        <Route path="/register" name="register" component={Register} />
        <Route path="/" name="full" component={Full} />
      </Switch>
    </AuthContext >
  );
}

export default App;
