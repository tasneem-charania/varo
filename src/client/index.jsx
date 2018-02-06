import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './login.jsx';
import Home from './home.jsx';
import EditVaro from './edit.jsx';
import CreateVaro from './create.jsx';
import Search from './search.jsx';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

injectTapEventPlugin();

class App extends React.Component {
  render () {
    return (
      <MuiThemeProvider>
        <Router>
            <div>
              <Route exact path="/" component={Login}/>
              <Route path="/home" component={Home}/>
              <Route path="/edit/:id" component={EditVaro}/>
              <Route path="/create" component={CreateVaro} />
              <Route path="/search" component={Search} />
            </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

render(<App/>, document.getElementById('app'));