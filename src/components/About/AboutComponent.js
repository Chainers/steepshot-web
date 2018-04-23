import React from 'react';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';
import {documentTitle} from '../../utils/documentTitle';
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
							<strong>High Quality. </strong>
							All published images should be of high quality.
						</li>
						<li>
							<strong>No Repulsive content. </strong>
							Your content should not be perceived as repulsive or shocking.
						</li>
						<li>
							<strong>No Hate Speech. </strong>
							Hate speech or “Internet trolling” will not be tolerated. Publications should not incite hatred or be
							directed against a social group. Also, one should not publish calls for violence or terrorism.
						</li>
						<li>
							<strong>Authorship. </strong>
							We do not want content with no attributes of authorship. (For example, a screenshot of the phone screen
							displaying someone else’s photo shows it lack uniqueness and indicates no form of authorship.) A
							watermark, original photo, or having yourself in the image could all be considered attributes of
							authorship.
						</li>
						<li>
							<strong>Fraud & Plagiarism Are Not Tolerated. </strong>
							You cannot: request for the transfer of money (for any reason), post anything related to scams, use
							threatening messaging (“upvote me or else I will downvote you” for example), or post others’ work and
							claim it as your own.
						</li>
						<li>
							<strong>NSFW. </strong>
							All adult content must be marked by the author by the
							<strong> #nsfw tag. </strong>
							Publication of pornographic content is not allowed whatsoever.
						</li>
						<li>
							<strong>Unsure? </strong>
							If you have doubts about your content, please refrain from publishing it.
						</li>
					</ol>
					<p>We expect users to flag the content that does not follow the rules mentioned above and allow ourselves to
						hide it. Also please direct users to the guidelines here if you find someone breaking them.</p>
				</div>
			</div>
		)
	}
}

export default withWrapper(AboutComponent);
