import React from 'react';
import {render} from 'react-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import Cookies from 'js-cookie';

class Login extends React.Component {

  constructor() {
    super();

    if(Cookies.getJSON('loginRequest')) {
      this.login(Cookies.getJSON('loginRequest'));
    }
  }

  render () {
    return (
      <div className="login-root">
        <div>
          <img src="images/logo.png"/>
        </div>
        <div>
          <TextField
            hintText="Username"
            floatingLabelText="Enter username"
            id="username"
          />
        </div>
        <div>
          <TextField
            hintText="Password"
            floatingLabelText="Enter password"
            type="password"
            id="password"
          />
        </div>
        <div className="login-button">
          <RaisedButton label="Login" primary={true} fullWidth={true} onTouchTap={this.handleTouchTap()}/>
        </div>
        <div>
        </div>
      </div>
    );
  }

  handleTouchTap() {
    return () => {
      this.login();
    };
  }

  login(loginRequest) {
    if(!loginRequest) {
      loginRequest = {
        username: $('#username').val(),
        password: $('#password').val()
      };
    }
    $.ajax({
      type: "POST",
      url: '/api/login',
      contentType: 'application/json',
      data: JSON.stringify(loginRequest),
      success: (result) => {
        Cookies.set('loginRequest', loginRequest, { expires: 1 });
        this.props.history.push('/home');
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }
}

export default Login;