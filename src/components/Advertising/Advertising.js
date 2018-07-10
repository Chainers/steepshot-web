import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {setAdvertisingStatus} from '../../actions/advertising';
import './advertising.css';

class Advertising extends React.Component {

	setAdvertisingStatus(status) {
		this.props.setAdvertisingStatus(status);
		this.container.classList.add('closed_advertising');
	}

	componentDidMount() {
		if (!this.props.advertisingStatus) {
			this.container.classList.remove('closed_advertising')
		}
	}

	render() {
		return (
			<div key="Advertising" className="block-in-body_advertising closed_advertising" ref={ref => this.container = ref}>
				<div className="wrapper_advertising centered--flex">
					<div className="sub-wrapper_advertising">
						<div className="text-wrapper_advertising">
							<p>Participate in our new contest. Make a post dealing with the topic of 2018 FIFA World Cup tagged
								both&nbsp;
								<Link to="/search/steepshotchallenge"
								      target="_blank"
								      rel="noopener noreferrer">#steepshotchallenge</Link> and&nbsp;
								<Link to="/search/worldcup"
								      target="_blank"
								      rel="noopener noreferrer">#worldcup</Link> until 22.06.18. Win amazing&nbsp;
								<a
									href="https://steemit.com/steem/@steepshot/steepshot-is-pleased-to-announce-a-new-photo-contest-dedicated-to-2018-fifa-world-cup-russia"
									target="_blank"
									rel="noopener noreferrer">rewards</a>!</p>
						</div>
						<div className="close-wrapper_advertising centered--flex"
						     onClick={this.setAdvertisingStatus.bind(this, true)}>
							<div className="close_advertising"/>
						</div>
					</div>
				</div>
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