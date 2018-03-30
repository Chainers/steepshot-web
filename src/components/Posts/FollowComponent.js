import React from 'react';
import {connect} from 'react-redux';
import Steem from '../../libs/steem';
import jqApp from "../../libs/app.min";

class FollowComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item: props.item,
			follow: props.item ? props.item['has_followed'] !== 0 : false,
			pendingStatus: false
		}
	}

	handleFollow() {
		this.followUnfollowToUser(this.state.follow);
	}

	followUnfollowToUser(status) {
		this.setState({
			pendingStatus: true
		});
		let callback = (err, result) => {
			this.setState({
				pendingStatus: false
			});
			if (err) {
				jqApp.pushMessage.open('Something went wrong, please, try again later');
			} else if (result) {
				let statusText = 'unfollowed';
				if (!status) statusText = 'followed';
				jqApp.pushMessage.open(`User has been successfully ${statusText}`);
				this.setState({
					follow: !this.state.follow
				})
			}
		};
		Steem.followUnfollowUser(this.props.postingKey, this.props.username, this.state.item.username, status, callback);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.item !== undefined && nextProps.item !== null)
			this.setState({
				item: nextProps.item,
				follow: nextProps.item ? nextProps.item['has_followed'] !== 0 : false
			});
	}

	render() {
		let componentClassNames;
		let componentName;
		if (this.state.pendingStatus) {
			componentClassNames = 'btn btn-index';
			componentName = <span className="saving">Pending<span> .</span><span> .</span><span> .</span></span>;
		} else {
			if (this.state.follow) {
				componentClassNames = 'btn btn-index';
				componentName = 'Unfollow';
			} else {
				componentClassNames = 'btn btn-default';
				componentName = 'Follow';
			}
		}

		let renderItem = null;

		if (this.state.item) {
			renderItem = <div className={componentClassNames} disabled={this.state.pendingStatus}>{componentName}</div>
		}

		return (
			<div className="btn-wrap" onClick={this.handleFollow.bind(this)}>
				{renderItem}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		localization: state.localization,
		username: state.auth.user,
		postingKey: state.auth.postingKey
	};
};

export default connect(mapStateToProps)(FollowComponent);
