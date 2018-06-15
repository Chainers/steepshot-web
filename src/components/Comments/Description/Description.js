import React from 'react';
import {connect} from 'react-redux';
import {UserLinkFunc} from '../../Common/UserLinkFunc';
import Tags from '../../PostsList/Post/Tags/Tags';
import './description.css';
import ShowIf from '../../Common/ShowIf';
import PromoteModal from '../../PostModal/PromoteModal/PromoteModal';
import {openModal} from '../../../actions/modal';
import MarkdownParser from "../../../utils/markdownParser";
import renderHTML from 'react-render-html';

class Description extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isDescriptionOpened: false
		}
	}

	openDescription() {
		this.setState({
			isDescriptionOpened: true
		});
	}

  openPromoteModal() {
    let modalOption = {
      body: (<PromoteModal postIndex={this.props.postIndex}/>),
    };
    this.props.openModal("PromoteModal", modalOption);
  }

	render() {
		return (
			<div className="container_description">
				{/*<ShowIf show={this.props.isSelfPost && !this.props.isGolos}>
					<div className="open-promote_description centered--flex" onClick={this.openPromoteModal.bind(this)}>
						PROMOTE THIS POST
					</div>
				</ShowIf>*/}
				<p>{UserLinkFunc(true, this.props.title)}</p>
				<div className={(this.state.isDescriptionOpened || (this.props.description.length < 140))
							? 'collapse-opened' : 'collapse-closed'}>
					{renderHTML(MarkdownParser.parse(this.props.description))}
					<Tags tags={this.props.tags}/>
					<a className="lnk-more" onClick={this.openDescription.bind(this)}>Show more</a>
				</div>
			</div>);
	}
}


const mapStateToProps = (state) => {
	let postIndex = state.postModal.currentIndex;
	let isSelfPost = state.auth.user === state.posts[postIndex].author;
	let isGolos = state.services.name === 'golos';
  return {
  	isGolos,
		postIndex,
		isSelfPost
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (index, option) => {
    	dispatch(openModal(index, option));
		}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Description);
