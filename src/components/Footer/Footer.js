import React from 'react';
import {Link} from 'react-router-dom';
import './footer.css';

class Footer extends React.Component {

	render() {
		return (
			<div>
				<div className="wrapper_footer">
					<div className="sub-wraper_footer">
						<div className="copyright_footer">Steepshot 2018. All rights reserved</div>
						<div className="social-links_footer">
								<Link to="/guide" className="link-guidelines_footer">Guidelines</Link>
								<a href="https://itunes.apple.com/by/app/steepshot/id1288494457?mt=8"
									 target="_blank"
									 rel="noopener noreferrer"
									 className="link-appstore_footer"> </a>
								<a href="https://play.google.com/store/apps/details?id=com.droid.steepshot&rdid=com.droid.steepshot"
									 target="_blank"
									 rel="noopener noreferrer"
									 className="link-googleplay_footer"> </a>
								<a href="https://t.me/steepshot_en"
									 target="_blank" rel="noopener noreferrer"  className="link-telegram_footer"> </a>
								<a href="https://discordapp.com/invite/9QsYr9f"
									 target="_blank" rel="noopener noreferrer" className="link-discord_footer"> </a>
						</div>
					</div>
				</div>
				<div className="js--page-bottom"/>
			</div>
		);
	}
}

export default Footer;
