import React from 'react';
import Header from './Header/Header';
import FunctionalUtils from './Common/FunctionalUtils';
import Advertising from './Advertising/Advertising';
import Body from './Body/Body';

const App = ({children}) => (
	<div className="container_app">
		<Advertising/>
		<Header/>
		<Test/>
		<FunctionalUtils/>
		<Body>{children}</Body>
	</div>
);

export default App;
