import React from 'react';
import Header from './Header';
import MobileNavigationComponent from './MobileNavigationComponent';
import FooterComponent from './FooterComponent';
import FunctionalUtils from "./Common/FunctionalUtils";

const App = ({children}) => (
	<div className="g-wrap">
		<div className="outer-bg">
			<Header/>
			<div className="g-main">
				{children || 'Loading'}
			</div>
		</div>
		<MobileNavigationComponent/>
		<FooterComponent/>
		<FunctionalUtils/>
	</div>
);

export default App;
