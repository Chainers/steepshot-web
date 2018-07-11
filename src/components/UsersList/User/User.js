import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from '../../Common/Avatar/Avatar';
import {connect} from 'react-redux';
import ShowIf from '../../Common/ShowIf';
import LoadingSpinner from '../../LoadingSpinner';
import './user.css';
import {changeFollow} from '../../../actions/userProfile';
import Constants from '../../../common/constants';

const User = ({user, authUser, changeFollow}) => {

	let amountMoney = null;
	let avatarSrc = user.avatar || Constants.NO_AVATAR;
	if (user.amount_sbd) {
		amountMoney = <span className="money_user">
										{(user.amount_sbd < 0 ? '-' : '+') + '$' + Math.abs(user.amount_sbd.toFixed(3))}
									</span>;
	}
	return (
		<div className="container_user">
			<div className="ava-name-wrap_user">
				<Link to={`/@${user.author}`}>
					<Avatar src={avatarSrc}
					        style={{width: 60, height: 60, position: 'static'}}
					        sizes={Constants.USER_CARD_AVATAR_SIZE}/>
				</Link>
				<div className="name_user">
					<Link to={`/@${user.author}`}>
						{user.author}
					</Link>
					{amountMoney}
				</div>
			</div>
			<ShowIf show={!!authUser && (user.author !== authUser)}>
				<div className="following-toggle-wrapper_user">
					<ShowIf show={!user.togglingFollow }>
						<ShowIf show={!user.has_followed}>
							<div className="follow-btn_user" onClick={() => changeFollow(user.author, user.has_followed)}>
								<img src="/images/userProfile/follow.svg"
								     alt="toggle follow"
								/>
							</div>
						</ShowIf>
						<ShowIf show={user.has_followed}>
							<div className="following_user">
								<img src="/images/userProfile/followed.svg"
								     alt="toggle follow"
								/>
							</div>
						</ShowIf>
					</ShowIf>
					<ShowIf show={user.togglingFollow}>
						<div className="spinner_user">
							<LoadingSpinner/>
						</div>
					</ShowIf>
				</div>
			</ShowIf>
		</div>
	);
};

const mapStateToProps = (state, props) => {
	const user = state.users[props.index];
	return {
		user: user ? user : {},
		authUser: state.auth.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeFollow: (followingName, followed) => {
			dispatch(changeFollow(followingName, followed));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
