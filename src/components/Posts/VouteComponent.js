import React from 'react';
import { Link } from 'react-router-dom';
import { voute } from '../../actions/raitingVoute';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class VouteComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      voute: this.props.item.voute
    }
  }

  ratingVotes() {
    voute(!this.state.voute, this.state.item.url)
      .then((json) => {
        console.log(json);
      });
    this.props.updateComponent(!this.state.voute);
    this.setState({ 
      voute: !this.state.voute
    });
  }

  render() {
    let component = <span className='star rating-text'>&#9825; {this.state.item.net_votes}</span>
    if (this.state.voute) {
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
    localization: state.localization
  };
};

export default connect(mapStateToProps)(VouteComponent);
