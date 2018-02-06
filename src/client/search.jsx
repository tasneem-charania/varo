import React from 'react';
import {render} from 'react-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';

class Search extends React.Component {

  constructor() {
    super();
    this.state = {
      varos: null,
      isLoading: false,
      error: false,
      fullName:''
    }
  }

  render() {
    return this.state.isLoading ? (
      <div className="sampleContainer">
        <div className="loader">
          <span className="dot dot_1"></span>
          <span className="dot dot_2"></span>
          <span className="dot dot_3"></span>
          <span className="dot dot_4"></span>
        </div>
      </div>
    ) :
      (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <TextField
                hintText="Full Name Must Exactly Match"
                floatingLabelText="Enter full name"
                id="fullName"
                fullWidth={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 margin-bottom-sm">
              <RaisedButton label="Search" primary={true} fullWidth={true} onTouchTap={this.handleTouchTap()}/>
              {this.displayError()}
            </div>
            <div className="col-md-12">
              <RaisedButton label="Back" secondary={true} fullWidth={true} onTouchTap={this.handleBack()}/>
            </div>
          </div>
          <div className="row name-table">
            <div className="col-md-6">
              <table className="table">
                <tbody>
                <tr>
                  <th>Date</th>
                  <th>Varo</th>
                </tr>
                {this.getVarosForUser()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
  }

  displayError() {
    const style = {
      color:"red"
    };
    if(this.state.error) {
      return <div style={style}>This field is required</div>
    }
  }

  handleTouchTap() {
    return () => {
      this.search();
    };
  }

  getVarosForUser() {
    if (!this.state.varo) {
      return null;
    }
    let varosForUser = this.state.varo.map((varo, index) => {
      let dateStringToDisplay = "";
      let dateLength = varo.date.length;

      if (dateLength == 6) {
        dateStringToDisplay = varo.date.slice(0, 2) + "/" + varo.date.slice(2, 4) + "/" + varo.date.slice(4)
      }
      else {
        dateStringToDisplay = varo.date.slice(0, 1) + "/" + varo.date.slice(1, 3) + "/" + varo.date.slice(3);
      }

      return (
        <tr key={index}>
          <td>{dateStringToDisplay}</td>
          <td>{this.getVaroToDisplay(varo)}</td>
        </tr>
      );
    });
    return varosForUser;
  }

  getVaroToDisplay(varo) {
    for (let i = 0, len = varo.varos.length; i < len; i++) {
      if (varo.varos[i].value == this.state.fullName) {
        return this.getVaroType(varo.varos[i].name);
      }
    }
    return null;
  }

  handleBack() {
    return () => {
      this.props.history.push('/home');
    }
  }

  getVaroType(name) {
    switch(name) {
      case "firstDua":
        return "First Dua";
      case "ashaji":
        return "Ashaji";
      case "secondDua":
        return "Second Dua";
      case "ginan":
        return "Ginan";
      case "farman":
        return "Farman";
      case "tasbih":
        return "Tasbih";
      case "kharaGinan":
        return "Khara Ginan";
      case "majlisGinan":
        return "Majlis Ginan";
      case "majlisFarman":
        return "Majlis Farman";
      case "majlisVenti":
        return "Majlis Venti";
      case "majlisTasbih":
        return "Majlis Tasbih";
      case "awalSufro":
        return "Awal Sufro";
      case "article":
        return "Article";
      default:
        return name;

    }
  }

  search() {
    let searchRequest = {};
    let fullName = $('#fullName').val();
    searchRequest.fullName = fullName;
    if (fullName == '') {
      this.setState({
        error: true
      });
      return;
    }
    this.setState({
      error:false,
      isLoading: true,
      fullName: searchRequest.fullName
    });
    $.ajax({
      type: "POST",
      url: '/api/search',
      contentType: 'application/json',
      data: JSON.stringify(searchRequest),
      success: (result) => {
        this.setState({
          varo: result,
          isLoading: false
        });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }
}

export default Search;