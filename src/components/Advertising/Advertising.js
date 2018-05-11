import React from 'react';
import './advertising.css';
import {setAdvertisingStatus} from '../../actions/advertising';
import ShowIf from "../Common/ShowIf";
import {connect} from "react-redux";

class Advertising extends React.Component {

  componentDidMount() {
    if (!localStorage.getItem('advertisingStatus')) {
      let outerElement = document.getElementsByClassName('outer-bg')[0];
      outerElement.style.transition = '.25s all ease-in';
      outerElement.classList.add('padding-top_advertising');
    }
  }

  setAdvertisingStatus(status) {
    this.props.setAdvertisingStatus(status);
    let outerElement = document.getElementsByClassName('outer-bg')[0];
    setTimeout(() => {
      outerElement.style.transition = '';
    }, 250);
    outerElement.classList.remove('padding-top_advertising');
  }

  render() {
    return(
      <div>
        <ShowIf show={this.props.advertisingStatus}>
          <div className="wrapper_advertising centered--flex">
            <div className="sub-wrapper_advertising">
              <div className="text-wrapper_advertising">
                <p>Your impressions can earn on Steepshot. Watch our new
                  <a href="https://youtu.be/4kCU0SRAKQg" target="_blank" rel="noopener noreferrer"> promo video</a> on YouTube!</p>
              </div>
              <div className="close-wrapper_advertising centered--flex" onClick={this.setAdvertisingStatus.bind(this, false)}>
                <div className="close_advertising"/>
              </div>
            </div>
          </div>
        </ShowIf>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    advertisingStatus: state.advertising.advertisingStatus
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdvertisingStatus: (status) => {
      dispatch(setAdvertisingStatus(status));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Advertising);