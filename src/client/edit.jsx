import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import RaisedButton from 'material-ui/RaisedButton';

class EditVaro extends React.Component {

  constructor() {
    super();
    this.state = {
      varo: null,
      editId: null
    };
  }

  componentDidMount() {
    this.setState({
      editId: this.props.match.params.id
    });
  }

  componentDidUpdate() {
    if(this.state.editId && !this.state.varo) {
      this.loadVaro();
    }
  }

  handleChange(key) {
    return (e) => {
      let tempVaro = this.state.varo;
      if(key == 'attendance' || key == 'event') {
        tempVaro[key] = e.target.value;
        this.setState({
          varo: tempVaro
        });
      }
      else {
        tempVaro = this.setValue(key,e.target.value);
        this.setState({
          varo: tempVaro
        });
      }
    }
  }

  convertAllValuesToLowercase(varo) {
    let tempVaro = this.state.varo;
    for(let i = 0, len = tempVaro.varos.length; i < len; i++) {
      tempVaro.varos[i].value = tempVaro.varos[i].value.toLowerCase();
    }
    return tempVaro;
  }

  render() {
    return this.state.varo ?
      (
        <div className="container">
          <div className="col-md-6 col-sm-12 col-xs-12 home-root">
            <div className="row margin-bottom-sm">
              <div className="col-md-12 margin-bottom-sm">
                <RaisedButton label="Back" primary={true} fullWidth={true} onTouchTap={this.handleBack()}/>
              </div>
              <div className="col-md-12">
                <RaisedButton label="Save Varo" secondary={true} fullWidth={true} onTouchTap={this.handleTouchTap()}/>
              </div>
            </div>
            <table className="today-table table-bordered table">
              <tbody>
              <tr>
                <th>Type</th>
                <th>Duty</th>
              </tr>
              <tr>
                <td className="blue">Attendance</td><td><input className="form-control" value={this.state.varo.attendance} onChange={this.handleChange('attendance')}/></td>
              </tr>
              <tr>
                <td className="blue">Event</td><td><input className="form-control" value={this.state.varo.event} onChange={this.handleChange('event')}/></td>
              </tr>
              <tr>
                <td className="blue">Ashaji</td><td><input className="form-control" value={this.getValue('ashaji')} onChange={this.handleChange('ashaji')}/></td>
              </tr>
              <tr>
                <td className="blue">First Dua</td><td><input className="form-control" value={this.getValue('firstDua')} onChange={this.handleChange('firstDua')}/></td>
              </tr>
              <tr>
                <td className="blue">Second Dua</td><td><input className="form-control" value={this.getValue('secondDua')} onChange={this.handleChange('secondDua')}/></td>
              </tr>
              <tr>
                <td className="blue">Tasbih</td><td><input className="form-control" value={this.getValue('tasbih')} onChange={this.handleChange('tasbih')}/></td>
              </tr>
              <tr>
                <td className="blue">Ginan</td><td><input className="form-control" value={this.getValue('ginan')} onChange={this.handleChange('ginan')}/></td>
              </tr>
              <tr>
                <td className="blue">Farman</td><td><input className="form-control" value={this.getValue('farman')} onChange={this.handleChange('farman')}/></td>
              </tr>
              <tr>
                <td className="blue">Khara Ginan</td><td><input className="form-control" value={this.getValue('kharaGinan')} onChange={this.handleChange('kharaGinan')}/></td>
              </tr>
              <tr>
                <td className="blue">Majlis Ginan</td><td><input className="form-control" value={this.getValue('majlisGinan')} onChange={this.handleChange('majlisGinan')}/></td>
              </tr>
              <tr>
                <td className="blue">Majlis Farman</td><td><input className="form-control" value={this.getValue('majlisFarman')} onChange={this.handleChange('majlisFarman')}/></td>
              </tr>
              <tr>
                <td className="blue">Majlis Venti</td><td><input className="form-control" value={this.getValue('majlisVenti')} onChange={this.handleChange('majlisVenti')}/></td>
              </tr>
              <tr>
                <td className="blue">Majlis Tasbih</td><td><input className="form-control" value={this.getValue('majlisTasbih')} onChange={this.handleChange('majlisTasbih')}/></td>
              </tr>
              <tr>
                <td className="blue">Awal Sufro</td><td><input className="form-control" value={this.getValue('awalSufro')} onChange={this.handleChange('awalSufro')}/></td>
              </tr>
              <tr>
                <td className="blue">Article</td><td><input className="form-control" value={this.getValue('article')} onChange={this.handleChange('article')}/></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
      <div className="sampleContainer">
        <div className="loader">
          <span className="dot dot_1"></span>
          <span className="dot dot_2"></span>
          <span className="dot dot_3"></span>
          <span className="dot dot_4"></span>
        </div>
      </div>
    )
  }

  handleBack() {
    return () => {
      this.props.history.push('/home');
    }
  }

  handleTouchTap() {
    return () => {
      $.ajax({
        type: "PUT",
        url: '/api/varo/' + this.state.editId,
        contentType: 'application/json',
        data: JSON.stringify(this.convertAllValuesToLowercase()),
        success: () => {
          this.props.history.push('/home');
        },
        fail: (err) => {
          console.log(err);
        }
      });
    };
  }

  loadVaro() {
    let editId = this.state.editId;
    $.ajax({
      type: "GET",
      url: '/api/varo/id/' + editId,
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

  getValue(value) {
    for(let i = 0, len = this.state.varo.varos.length; i < len; i++) {
      if(this.state.varo.varos[i].name == value) {
        return this.state.varo.varos[i].value;
      }
    }
  }

  setValue(key,value) {
    let tempVaro = this.state.varo;
    for(let i = 0, len = tempVaro.varos.length; i < len; i++) {
      if(tempVaro.varos[i].name == key) {
        tempVaro.varos[i].value = value;
        break;
      }
    }
    return tempVaro;
  }
}

export default EditVaro;