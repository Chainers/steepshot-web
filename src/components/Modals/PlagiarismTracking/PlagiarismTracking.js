import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {closeModal} from '../../../actions/modal';
import {editPostRequest, editPostSuccess, editPostReject} from '../../../actions/editPost';
import Steem from '../../../libs/steem';
import constants from '../../../common/constants';
import jqApp from "../../../libs/app.min";
import {push} from "react-router-redux";
import './plagiarismTracking.css';

class PlagiarismTracking extends React.Component {

	constructor(props) {
		super(props);
	}

	renderImage() {
		let image = {
			background: `#f4f4f6 url('https://steepshot.org/ipfs/${this.props.data.ipfs}') center no-repeat`,
			backgroundSize: 'contain'
		};
		return (
			<div className="image_plag-track" style={image}/>
		)
	}

	closeModal() {
		this.props.closeModal('PlagiarismTrackingModal');
	}

	continuePublishing() {
		let data = this.props.data;
		Steem.afterCheckingPlagiarism(data.operation, data.prepareData, data.beneficiaries).then(() => {
			jqApp.pushMessage.open(constants.POST_SUCCESSFULLY_CREATED);
			this.props.editPostSuccess();
			this.props.historyPush(`/@${this.props.authUser}`);
		})
			.catch(error => {
				this.props.editPostReject(error);
				jqApp.pushMessage.open(error.message);
			});
		this.props.closeModal('PlagiarismTrackingModal');
		this.props.editPostRequest();
	}

	render() {
		let linkToPlagPhoto = `/${this.props.data.plagiarism_author}/${this.props.data.plagiarism_permlink}`;
		let linkToPlagUser = `/@${this.props.data.plagiarism_author}`;
		return (
			<div className="wrapper_plag-track">
				<div className="title-wrapper_plag-track">
					<p className="title_plag-track">PLAGIARISM CHECK</p>
					<p>
						<a href={`https://steepshot.org/ipfs/${this.props.data.ipfs}`} target="_blank">IPFS link</a>
					</p>
				</div>
				{this.renderImage()}
				<p className="descrip_plag-track">We have found a
					<Link to={linkToPlagPhoto} target="_blank"> similar photo</Link> in Steepshot, uploaded by
					<Link to={linkToPlagUser} target="_blank"> @{this.props.data.plagiarism_author}</Link>.
					We do not recommend you to upload other users' photos as it may result in low payouts and reputation loss.</p>
				<p className="sub-descrip_plag-track">If you're sure that you are the author of the photo, please flag and/or
					leave a comment under the
					<Link to={linkToPlagPhoto} target="_blank"> photo </Link>
					to let other people know they should flag this post.</p>
				<p className="guidelines_plag-track">
					<Link to="/guide" target="_blank">Posting guidelines</Link>
				</p>
				<div className="buttons_plag-track">
					<button className="btn btn-index" onClick={this.closeModal.bind(this)}>NO, CANCEL PUBLISHING</button>
					<button className="btn btn-default" onClick={this.continuePublishing.bind(this)}>YES, CONTINUE PUBLISHING
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...props,
		authUser: state.auth.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: (index) => {
			dispatch(closeModal(index));
		},
		editPostRequest: () => {
			dispatch(editPostRequest());
		},
		editPostSuccess: () => {
			dispatch(editPostSuccess());
		},
		editPostReject: (error) => {
			dispatch(editPostReject(error));
		},
		historyPush: (path) => {
			dispatch(push(path))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlagiarismTracking);
