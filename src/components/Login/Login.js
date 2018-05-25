import React, {Component} from 'react';
import {connect} from 'react-redux'
import {documentTitle} from '../../utils/documentTitle';
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";
import './login.css';
import ShowIf from "../Common/ShowIf";
import ReactPlayer from 'react-player'
import Constants from "../../common/constants";
import FormInput from "../Common/FormInput/FormInput";
import {setErrorFormInput} from "../../actions/formInput";
import {login} from "../../actions/auth";

const NAME_POINT = "name_login";
const PASSWORD_POINT = "posting-key_login";

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			openVideo: false
		};
	}

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	static openRegisterSite(event) {
		event.preventDefault();
		window.open('https://steemit.com/pick_account');
	}

	componentDidMount() {
		documentTitle();
	}

	handleLogin(e) {
		e.preventDefault();
		if (!this.props.nameValue) {
			this.props.setErrorFormInput(NAME_POINT, 'Username is required')
		}
		if (!this.props.passwordValue) {
			this.props.setErrorFormInput(PASSWORD_POINT, 'Posting key is required')
		}
		if (!this.props.nameValue || !this.props.passwordValue) {
			return;
		}
		this.props.login(this.props.nameValue, this.props.passwordValue);
	}

	openVideo() {
		this.setState({
			openVideo: true
		}, () => {
			//scrollToComponent(this.player, {align: 'bottom'});
		})
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="container_login">
				<div className="welcome-body_login">
				</div>
				<div className="form-body_login">
					<div className="title_login">
						Sign in Steepshot
					</div>
					<form className="form_login">
						<FormInput point={NAME_POINT} label="Name"/>
						<FormInput point={PASSWORD_POINT} label="Posting Key" type="password"/>
						<div className="btn-group_login">
							<button className="create-acc_login" onClick={Login.openRegisterSite} type="button">Create new Steem
								account
							</button>
							<button className="sign_login" onClick={this.handleLogin.bind(this)} type="submit">Log In with Steem
							</button>
						</div>
					</form>
					<div className="how-sign_login">
						<ShowIf show={!this.state.openVideo}>
							Also you can check <span className="show-video-btn_login" onClick={this.openVideo.bind(this)}>
							how to sign in to Steepshot
						</span>
						</ShowIf>
						<ShowIf show={this.state.openVideo}>
							<div className="video-cont_login">
								<ReactPlayer
									height='100%'
									width='100%'
									url={Constants.TUTORIAL.LINK}
									playing={true}
									controls={true}
									ref={ref => this.player = ref}
								/>
							</div>
						</ShowIf>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		nameValue: state.formInput[NAME_POINT] ? state.formInput[NAME_POINT].value : '',
		passwordValue: state.formInput[PASSWORD_POINT] ? state.formInput[PASSWORD_POINT].value : ''
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setErrorFormInput: (point, message) => {
			dispatch(setErrorFormInput(point, message));
		},
		login: (name, postingKey) => {
			dispatch(login(name, postingKey));
		}
	}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Login));
