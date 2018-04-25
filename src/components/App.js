import React from 'react';
import Header from './Header';
import MobileNavigationComponent from './MobileNavigationComponent';
import FooterComponent from './FooterComponent';
import FunctionalUtils from "./Common/FunctionalUtils";
import BodyLoader from "./Common/BodyLoader/BodyLoader";

const App = ({children}) => (
	<div className="g-wrap">
		<div className="outer-bg">
			<Header/>
			<div className="g-main">
				{children || 'Loading'}
				<BodyLoader />
			</div>
		</div>
		<MobileNavigationComponent/>
		<FooterComponent/>
		<FunctionalUtils/>
	</div>
);

export default App;
