import React from 'react';
import Footer from '../Footer/Footer';
import Scroll from '../Scroll/Scroll';
import './body.css';

const SCROLL_POINT = 'body';

class Body extends React.Component {

	render() {
		const {children} = this.props;
		return (
			<div className="container_body" key="Main">
				<Scroll point={SCROLL_POINT} className="scroll_body">
					<div className="for-space-between">
						{children}
					</div>
					<Footer/>
				</Scroll>
			</div>
		);
	}
}

export default Body;
