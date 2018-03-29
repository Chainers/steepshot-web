import React from 'react'
import {documentTitle} from './DocumentTitle';
import {withWrapper} from "create-react-server/wrapper";
import {addMetaTags, getDefaultTags} from "../actions/metaTags";

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
			<div className="g-main">
				<div className="g-main_i container">
					<div className="row">
						<div id="workspace" className="g-content col-xs-12 clearfix">
							<h1 id="title" className="hidden">404</h1>
							<div className="empty-query-message">
								<div className="eqm-ttl">404 error</div>
								Ooops… Page not found. Try to refresh this page or check your internet connection.
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withWrapper(NotFound);
