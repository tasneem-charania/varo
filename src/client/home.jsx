import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import RaisedButton from 'material-ui/RaisedButton';
import Cookies from 'js-cookie';
import DatePicker from 'material-ui/DatePicker';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      varo: null,
      searchDate: null
    };
    this.loadVaro();
  }
  render() {

    let DateTimeFormat = global.Intl.DateTimeFormat;

    return this.state.varo ?
      (
      <div className="container">
        <div className="col-md-6 col-sm-12 col-xs-12 home-root">
          <div className="row">
            <div className="col-md-5 col-md-offset-2 margin-bottom-sm">
              <DatePicker
                hintText="Enter date to display varos for mm/dd/yy"
                fullWidth={true}
                id="dateToSearch"
                container="inline"
                formatDate={new DateTimeFormat('en-US', {
                  day: 'numeric',
                  month: 'numeric',
                  year: '2-digit',
                }).format}
              />
            </div>
            <div className="col-md-1 margin-bottom-sm">
              <RaisedButton label="Display" fullWidth={true} onTouchTap={this.display()}/>
            </div>
            <div className="col-md-12 margin-bottom-sm">
              <RaisedButton label="Search By Name" fullWidth={true} onTouchTap={this.search()}/>
            </div>
          </div>
          <div className="row margin-bottom-sm">
            <div className="col-md-12">
              <RaisedButton label="Edit Varo" secondary={true} fullWidth={true} onTouchTap={this.handleTouchTap()}/>
            </div>
          </div>
          <table className="today-table table-bordered table">
            <tbody>
              <tr>
                <th>Type</th>
                <th>Duty</th>
              </tr>
              <tr>
                <td className="blue">Attendance</td><td>{this.state.varo.attendance}</td>
              </tr>
              <tr>
                <td className="blue">Event</td><td>{this.state.varo.event}</td>
              </tr>
              <tr>
                <td className="blue">Ashaji</td><td>{this.getValue('ashaji')}</td>
              </tr>
              <tr>
                <td className="blue">First Dua</td><td>{this.getValue('firstDua')}</td>
              </tr>
              <tr>
                <td className="blue">Second Dua</td><td>{this.getValue('secondDua')}</td>
              </tr>
              <tr>
                <td className="blue">Tasbih</td><td>{this.getValue('tasbih')}</td>
              </tr>
              <tr>
                <td className="blue">Ginan</td><td>{this.getValue('ginan')}</td>
              </tr>
              <tr>
                <td className="blue">Farman</td><td>{this.getValue('farman')}</td>
              </tr>
              <tr>
                <td className="blue">Khara Ginan</td><td>{this.getValue('kharaGinan')}</td>
              </tr>
              <tr>
                <td className="blue">Majlis Ginan</td><td>{this.getValue('majlisGinan')}</td>
              </tr>
              <tr>
                <td className="blue">Majlis Farman</td><td>{this.getValue('majlisFarman')}</td>
              </tr>
              <tr>
                <td className="blue">Majlis Venti</td><td>{this.getValue('majlisVenti')}</td>
              </tr>
              <tr>
                <td className="blue">Majlis Tasbih</td><td>{this.getValue('majlisTasbih')}</td>
              </tr>
              <tr>
                <td className="blue">Awal Sufro</td><td>{this.getValue('awalSufro')}</td>
              </tr>
              <tr>
                <td className="blue">Article</td><td>{this.getValue('article')}</td>
              </tr>
            </tbody>
          </table>
          <div className="row margin-top-sm">
            <div className="col-md-12">
              <RaisedButton label="Log Out" secondary={true} fullWidth={true} onTouchTap={this.handleLogOut()}/>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="container">
        <div className=" create-root">
          <div className="row">
            <div className="col-md-5 col-md-offset-2 margin-bottom-sm">
              <DatePicker
                hintText="Enter date to display varos for mm/dd/yy"
                fullWidth={true}
                id="dateToSearch"
                container="inline"
                formatDate={new DateTimeFormat('en-US', {
                  day: 'numeric',
                  month: 'numeric',
                  year: '2-digit',
                }).format}
              />
            </div>
            <div className="col-md-1 margin-bottom-sm">
              <RaisedButton label="Display" fullWidth={true} onTouchTap={this.display()}/>
            </div>
          </div>
          <div className="row margin-bottom-sm">
            <div className="col-md-6 col-md-offset-2">
              <RaisedButton label="Search By Name" fullWidth={true} onTouchTap={this.search()}/>
            </div>
          </div>
          <div className="row margin-bottom-sm">
            <div className="col-md-6 col-md-offset-2">
              <RaisedButton label="Create New Varo" primary={true} fullWidth={true} onTouchTap={this.handleCreateNew()}/>
            </div>
          </div>
          <div className="row margin-top-sm">
            <div className="col-md-6 col-md-offset-2">
              <RaisedButton label="Log Out" secondary={true} fullWidth={true} onTouchTap={this.handleLogOut()}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleTouchTap() {
    let editUrl = '/edit/' + this.state.varo._id;
    return () => {
      this.props.history.push(editUrl);
    };
  }

  handleLogOut() {
    return () => {
      Cookies.remove('loginRequest');
      this.props.history.push('/');
    };
  }

  handleCreateNew() {
    return () => {
      this.props.history.push('/create');
    };
  }

  display() {
    return () => {
      let date;
      let dateString;

      if($('#dateToSearch').val() && $('#dateToSearch').val() != '') {
        dateString = $('#dateToSearch').val().replace(/\//g, '');
      }
      else {
        date = new Date();
        dateString = (date.getMonth() + 1) + "" + date.getDate() + "" + date.getFullYear().toString().substr(2,2);
      }

      $.ajax({
        type: "GET",
        url: '/api/varo/date/' + dateString,
        contentType: 'application/json',
        success: (result) => {
          this.setState({
            varo: result
          })
        },
        fail: (err) => {
          console.log(err);
        }
      });
    };
  }

  search() {
    return () => {
      this.props.history.push('/search');
    }
  }

  getValue(value) {
    for(let i = 0, len = this.state.varo.varos.length; i < len; i++) {
      if(this.state.varo.varos[i].name == value) {
        return this.state.varo.varos[i].value;
      }
    }
  }

  loadVaro() {
    let date;
    let dateString;
    date = new Date();
    dateString = (date.getMonth() + 1) + "" + date.getDate() + "" + date.getFullYear().toString().substr(2,2);

    $.ajax({
      type: "GET",
      url: '/api/varo/date/' + dateString,
      contentType: 'application/json',
      success: (result) => {
        this.setState({
          varo: result
        })
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }
}

export default Home;