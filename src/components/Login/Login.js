import React, {Component} from 'react';
import {connect} from 'react-redux'
import {documentTitle} from '../../utils/documentTitle';
import {addMetaTags, getDefaultTags} from '../../actions/metaTags';
import {withWrapper} from 'create-react-server/wrapper';
import './login.css';
import ShowIf from '../Common/ShowIf';
import {login} from '../../actions/auth';
import ImageGallery from './ImageGallery/ImageGallery';
import {push} from 'react-router-redux';
import Constants from '../../common/constants';
import {switchService} from '../../actions/services';
import {clearLoginErrors} from '../../actions/login';
import Switcher from '../Switcher/Switcher';
import ChooseSteemRegModal from './ChooseSteemRegModal/ChooseSteemRegModal';
import {openModal} from '../../actions/modal';

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

	openRegisterSite(event) {
		event.preventDefault();
		if (this.props.chooseSteem) {
      let modalOption = {
        body: (<ChooseSteemRegModal/>),
      };
      this.props.openModal("ChooseSteemRegModal", modalOption);
			// window.open('https://steemit.com/pick_account');
		} else {
			window.open('https://golos.io/create_account');
		}
	}

	componentDidMount() {
		documentTitle();
	}

	handleLogin(e) {
		e.preventDefault();
		this.props.login(this.name.value, this.password.value);
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		const {chooseSteem, switchService, usernameError, postingKeyError, clearLoginErrors} = this.props;
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
								<input type="text" className="input_login" ref={ref => this.name = ref}
											 onChange={() => clearLoginErrors()}/>
								<label className="error-msg_login">{usernameError}</label>
								<label className="input-label_login">Posting Key</label>
								<input type="password" className="input_login" ref={ref => this.password = ref}
											 onChange={() => clearLoginErrors()}/>
								<label className="error-msg_login">{postingKeyError}</label>
							</div>
							<div className="btn-block_login">
								<Switcher
									onClick={() => {
										clearLoginErrors();
										switchService();
									}}
									left={chooseSteem}
									leftLabel="Steem"
									rightLabel="Golos"
								/>
								<button className="sign_login btn btn-default" onClick={this.handleLogin.bind(this)} type="submit">
									Login
								</button>
							</div>
						</form>
					</div>
					<div className="registration-block_login">
						<label>Don’t have a {chooseSteem ? 'Steem' : 'Golos'} account?</label>
						<button className="guidelines-btn_login create-acc_login" onClick={this.openRegisterSite.bind(this)}>
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
		isMobileScreen: state.window.isMobileScreen,
		chooseSteem: state.services.name === Constants.SERVICES.steem.name,
		usernameError: state.login.usernameError,
		postingKeyError: state.login.postingKeyError
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (name, postingKey) => {
			dispatch(login(name, postingKey));
		},
		historyPush: (path) => {
			dispatch(push(path))
		},
		switchService: () => {
			dispatch(switchService())
		},
		clearLoginErrors: () => {
			dispatch(clearLoginErrors())
		},
		openModal: (index, options) => {
			dispatch(openModal(index, options));
		}
	}
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Login));
