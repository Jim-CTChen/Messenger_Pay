import { Route, Switch } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Full from './container/Full'

function App() {
  return (
    <Switch>
      <Route path="/" name="full" component={Full}></Route>
    </Switch>
  );
}

export default App;
