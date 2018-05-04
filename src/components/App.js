import React from 'react';
import Header from './Header';
import Footer from './Footer/Footer';
import FunctionalUtils from "./Common/FunctionalUtils";
import BodyLoader from "./Common/BodyLoader/BodyLoader";
import MobileNavigation from "./MobileNavigation/MobileNavigation";

const App = ({children}) => (
	<div className="g-wrap">
		<div className="outer-bg">
			<Header/>
			<div className="g-main">
				{children || 'Loading'}
				<BodyLoader/>
			</div>
		</div>
		<MobileNavigation/>
		<Footer/>
		<FunctionalUtils/>
	</div>
);

export default App;
