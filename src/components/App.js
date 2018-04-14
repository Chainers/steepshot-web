import React from 'react';
import Header from './Header';
import MobileNavigationComponent from './MobileNavigationComponent';
import FooterComponent from './FooterComponent';
import Clipboard from "./Common/Clipboard/Clipboard";
import Modals from './Modals/Modals';
import PushNotifications from "./PushNotifications/PushNotifications";
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
		<div className="pm"></div>
		<FooterComponent/>
		<PushNotifications/>
		<FunctionalUtils/>
		<Clipboard/>
		<Modals/>
	</div>
);

export default App;
