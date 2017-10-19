import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  voute
} from '../../actions/raitingVoute';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';

class FlagComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      item: this.props.item,
      flag: this.props.item.flag
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: this.props.index,
      item: this.props.item,
      vote: this.props.item.vote
    });
  }

  updateFlag() {
    if (!(this.props.username || this.props.postingKey)) {
      return;
    }
    const newFlagState = !this.state.flag;
    const urlObject = this.state.item.url.split('/');

    this.props.updateFlagInComponent(newFlagState, this.state.index);
    this.setState({ 
      flag: newFlagState
    });

    Steem.vote(this.props.postingKey, this.props.username, this.state.item.author, urlObject[urlObject.length-1], newFlagState);
  }

  render() {
    let component = <button type="button" className="btn-flag"></button>;

    if (this.state.flag) {
      component = <button type="button" className="btn-flag marked"></button>;
    }
    
    return (
        <div className="wrap-btn" onClick={(event) => this.updateFlag.call(this, event)}>
          {component}
        </div>
    );
  }
}

FlagComponent.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(FlagComponent);
