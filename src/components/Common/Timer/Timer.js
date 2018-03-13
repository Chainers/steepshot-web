import React from 'react';
import ShowIf from "../ShowIf";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

class Timer extends React.Component {

  static defaultProps = {
    onTimeout: () => {
    },
    waitingTime: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      waitingTime: this.props.waitingTime,
      targetTime: new Date(new Date().getTime() + this.props.waitingTime),
      show: false
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const waitingTime = this.state.targetTime - new Date();
    if (waitingTime < 0.5 * MILLISECONDS_IN_SECOND) {
      clearInterval(this.timer);
      this.setState({
        waitingTime: 0,
        show: false
      });
      this.props.onTimeout();
      return;
    }
    this.setState({
      waitingTime: waitingTime,
      show: true
    })
  }

  render() {
    let seconds = Math.round(this.state.waitingTime / MILLISECONDS_IN_SECOND);
    let minutes = Math.round(seconds / SECONDS_IN_MINUTE);
    let hours = Math.round(minutes / MINUTES_IN_HOUR);
    seconds %= SECONDS_IN_MINUTE;
    minutes %= MINUTES_IN_HOUR;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return (
      <span className={this.props.className} style={this.props.style}>
        <ShowIf show={hours}>
          <span>{hours}:</span>
        </ShowIf>
        <span>{minutes}:</span>
        <span>{seconds}</span>
      </span>
    )
  }
}

export default Timer;
