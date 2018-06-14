import React from 'react';
import {connect} from 'react-redux';
import renderHTML from 'react-render-html';
import './pushMessage.css';

class PushMessage extends React.Component {

	constructor(props) {
		super(props);
		this.renderMessage = this.renderMessage.bind(this);
		this.renderAllMessages = this.renderAllMessages.bind(this);
	}

	renderMessage(message, index) {
		return (
			<div key={index} className={'body_push-msg' + (message.willClose ? ' will-close_push-msg' : '')}
					 style={{marginBottom: message.up ? 0 : -200}}
			>
				<div className="text-wrap_push-msg">
          {renderHTML(message.message)}
				</div>
			</div>
		);
	}

	renderAllMessages() {
		const result = [];
		for (let index in this.props.messages) {
			result.push(
				this.renderMessage(this.props.messages[index], index)
			);
		}
		return result;
	}

	render() {
		return (
			<div className="container_push-msg">
				{this.renderAllMessages()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		messages: state.pushMessage
	};
};

export default connect(mapStateToProps)(PushMessage);
