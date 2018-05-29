import React, {Component} from 'react';
import {connect} from 'react-redux'
import {documentTitle} from '../../utils/documentTitle';
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";
import './login.css';
import ShowIf from "../Common/ShowIf";
import {setErrorFormInput} from "../../actions/formInput";
import {login} from "../../actions/auth";
import ImageGallery from "./ImageGallery/ImageGalLery";
import {push} from 'react-router-redux';

const NAME_POINT = "name_login";
const PASSWORD_POINT = "posting-key_login";
const galleryImages = [
	'/images/login/1.png',
	'/images/login/2.png',
	'/images/login/3.png',
	'/images/login/4.png',
	'/images/login/5.png',
	'/images/login/6.png',
	'/images/login/7.png',
	'/images/login/8.png',
	'/images/login/9.png',
	'/images/login/10.png'
];

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

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="container_login">
				<ShowIf show={!this.props.isMobileScreen}>
					<div className="welcome-container_login">
						<ImageGallery images={galleryImages}/>
						<div className="gallery-shadow_login"/>
						<div className="welcome-body_login">
							<div className="welcome-title_login">
								Welcome to Steepshot
							</div>
							<div className="welcome-description_login">
								Platform that rewards people for sharing their lifestyle and visual experience
							</div>
							<button className="guidelines-btn_login" onClick={() => {
								this.props.historyPush('/guide')
							}}>
								LINK TO OUR GUIDELINES
							</button>
						</div>
					</div>
				</ShowIf>
				<div className="form-container_login">
					<div className="form-body_login">
						<form className="form_login">
							<div className="title_login">
								Sign in to Steepshot
							</div>
							<div className="input-block_login">
								<label className="input-label_login">Username</label>
								<input type="text" className="input_login"/>
								<label className="error-msg_login">error</label>
								<label className="input-label_login">Posting Key</label>
								<input type="password" className="input_login"/>
								<label className="error-msg_login">error</label>
							</div>
							<div className="btn-block_login">
								<div className="switcher_login">
									<label className="switcher-label_login">Steem</label>
									<div className="switcher-input_login"/>
									<label className="switcher-label_login">Golos</label>
								</div>
								<button className="sign_login btn btn-default" onClick={this.handleLogin.bind(this)} type="submit">
									Login
								</button>
							</div>
						</form>
					</div>
					<div className="registration-block_login">
						<label>Don’t have an Steem account?</label>
						<button className="guidelines-btn_login create-acc_login" onClick={Login.openRegisterSite}>
							REGISTRATION
						</button>
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
		passwordValue: state.formInput[PASSWORD_POINT] ? state.formInput[PASSWORD_POINT].value : '',
		isMobileScreen: state.window.isMobileScreen
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setErrorFormInput: (point, message) => {
			dispatch(setErrorFormInput(point, message));
		},
		login: (name, postingKey) => {
			dispatch(login(name, postingKey));
		},
		historyPush: (path) => {
			dispatch(push(path))
		}
	}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Login));
