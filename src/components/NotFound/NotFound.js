import React from 'react'
import {documentTitle} from '../../utils/documentTitle';
import {withWrapper} from 'create-react-server/wrapper';
import {addMetaTags, getDefaultTags} from '../../actions/metaTags';
import {Link} from 'react-router-dom';
import './notFound.css';

class NotFound extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	componentDidMount() {
		documentTitle();
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
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

export default withWrapper(NotFound);
