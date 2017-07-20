import React from 'react';
import { Link } from 'react-router-dom';
import { voute } from '../../actions/raitingVoute';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import steem from 'steem';

class VouteComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      vote: this.props.item.vote
    }
  }

  ratingVotes() {
    this.props.updateComponent(!this.state.vote);
    this.setState({ 
      vote: !this.state.vote
    });

    const urlObject = this.state.item.url.split('/');
    const username = this.props.username;
    const wif = this.props.postingKey;
    const author = this.state.item.author;

    const resultP = steem.api.getContentAsync(author, urlObject[urlObject.length-1]);
    resultP.then((result) => {
      steem.broadcast.vote(wif, username, result.author, result.permlink, result.reward_weight, () => { return; });
    });
  }

  render() {
    let component = <span className='star rating-text'>&#9825; {this.state.item.net_votes}</span>
    if (this.state.vote) {
      component = <span className='star rating-text filled'>&hearts; {this.state.item.net_votes}</span>
    }
    return (
        <div className="rating-block pull-right span-with-no-border" onClick={(event) => this.ratingVotes.call(this, event)}>
          {component}
        </div>
    );
  }
}

VouteComponent.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(VouteComponent);
