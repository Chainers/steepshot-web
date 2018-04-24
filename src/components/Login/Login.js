import React from 'react';
import {connect} from 'react-redux'
import {documentTitle} from '../../utils/documentTitle';
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";
import './login.css';
import ShowIf from "../Common/ShowIf";
import ReactPlayer from 'react-player'

class Login extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	componentWillMount() {
		documentTitle();
	}


	validate() {
		let valid = true;
		if (this.state.userName === '') {
			this.setState({
				userNameError: true
			});
			valid = false;
		}
		if (this.state.postingKey === '') {
			this.setState({
				postingKeyError: true
			});
			valid = false;
		}
		return valid;
	}

	handleLogin(e) {
		e.preventDefault();
		if (!this.validate()) return false;
	}

	openRegisterSite() {
		window.open('https://steemit.com/pick_account');
	}


	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="container_login">
				<div className="title_login">
					Sign in Steepshot
				</div>
				<form className="form_login">
					<input/>
					<input type="password"/>
					<div className="btn-group_login">
						<button className="create-acc_login">Create new Steem account</button>
						<button className="sign_login">Log In with Steem</button>
					</div>
				</form>
				<div className="how-sign_login">
					<ShowIf show={true}>
						Also you can check <span className="show-video-btn_login">how to sign in to Steepshot</span>
					</ShowIf>
					<ShowIf show={false}>
						<div className="video-cont_login">
							<ReactPlayer
								height='100%'
								url={this.props.urlVideo}
								playing={true}
								loop={true}/>
						</div>
					</ShowIf>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		messages: state.messages,
		user: state.auth.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Login));
