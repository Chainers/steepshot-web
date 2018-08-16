import React from 'react';
import {documentTitle} from '../../utils/documentTitle';
import {Link} from 'react-router-dom';
import './notFound.css';

class NotFound extends React.Component {

	componentDidMount() {
		documentTitle();
	}

	render() {
		return (
			<div className="for-background_not-found">
				<div className="wrapper_not-found">
					<p className="title_not-found">404 error</p>
					<p className="subtitle_not-found">Ooops… Page isn't found. Try to check url address or your internet
						connection.</p>
					<Link to="/browse" className="btn-default btn_not-found centered--flex">
						GO TO MAIN PAGE
					</Link>
				</div>
			</div>
		);
	}
}

export default NotFound;
