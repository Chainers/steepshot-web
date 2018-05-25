import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import FunctionalUtils from "./Common/FunctionalUtils";
import BodyLoader from "./Common/BodyLoader/BodyLoader";
import Advertising from "./Advertising/Advertising";

const App = ({children}) => (
	<div className="outer-bg">
		<Advertising/>
		<Header/>
		<FunctionalUtils/>
		<div className="g-main">
			{children || 'Loading'}
			<BodyLoader/>
			<Footer/>
		</div>
	</div>
);

export default App;
