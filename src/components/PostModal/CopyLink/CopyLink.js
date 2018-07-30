import React from 'react';
import './copyLink.css';

class CopyLink extends React.Component {

	constructor() {
		super();
		this.state = {
			clicked: false,
			timeout: null
		}
	}

	onClick(e) {
		e.target.blur();
		this.props.onClick();
		this.setState(() => {
			return {
				clicked: true,
				timeout: setTimeout(() => {
					this.setState(() => {
						return {clicked: false}
					})
				}, 2000)
			}
		})
	}

	render() {
		return (
			<button className={'btn btn-default btn-xs ' + (this.props.className || '')}
			        onClick={this.onClick.bind(this)} disabled={this.state.clicked}>
				COPY LINK
			</button>
		)
	}
}

export default CopyLink;