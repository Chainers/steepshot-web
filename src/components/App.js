import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Advertising from './Advertising/Advertising';
import FunctionalUtils from "./Common/FunctionalUtils";
import BodyLoader from "./Common/BodyLoader/BodyLoader";

const App = ({children}) => (
	<div className="g-wrap">
		<div className="outer-bg">
			<Advertising/>
			<Header/>
			<FunctionalUtils/>
			<div className="g-main">
				{children || 'Loading'}
				<BodyLoader/>
			</div>
		</div>
		<Footer/>
	</div>
);

export default App;
