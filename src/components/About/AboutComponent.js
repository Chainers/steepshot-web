import React from 'react';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';
import {documentTitle} from '../../utils/documentTitle';
import {connect} from "react-redux";
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";

class AboutComponent extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	componentWillMount() {
		documentTitle();
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="card-field about">
				<div className="about__heading text--center">
					<HeadingLeadComponent text={<h2>Community guidelines</h2>}/>
				</div>
				<div className="about__list">
					<p>We encourage you to follow simple rules when publishing:</p>
					<ol className="styled">
						<li>
							<strong>Quality. </strong>
							All published images should be of high quality.
						</li>
						<li>
							<strong>Repulsive content. </strong>
							Your content should not be perceived as repulsive and shocking.
						</li>
						<li>
							<strong>Hate Speech or Internet Trolling. </strong>
							Publications should not incite hatred and be directed against a social group. Also, one should not publish
							calls for violence or terrorism.
						</li>
						<li>
							<strong>Authorship. </strong>
							It is undesirable to publish something that has no attributes of authorship. For example, a screenshot of
							the phone screen.
						</li>
						<li>
							<strong>Fraud and plagiarizm </strong>
							is not allowed. You should not publish requests for the transfer of money (for any reason) and negative
							media (messages in the spirit of "repay it, or it will happen terrible").
						</li>
						<li>
							<strong>NSFW. </strong>
							All adult content must be marked by the author by the
							<strong> #nsfw tag. </strong>
							Publication of pornographic content is not allowed.
						</li>
						<li>If you have doubts about your content, refrain from publishing.</li>
					</ol>
					<p>We expect users to downvote the content that does not follow the rules mentioned above and allow ourselves
						to hide it.</p>
				</div>
			</div>
		)
	}
}

export default withWrapper(AboutComponent);
