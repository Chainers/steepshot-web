import React from 'react';
import Header from './Header';
import MobileNavigationComponent from './MobileNavigationComponent';
import FooterComponent from './FooterComponent';
import Clipboard from "./Common/Clipboard/Clipboard";
import Modals from './Modals/Modals';
import LikesModal from './Common/LikeModal';

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

    <LikesModal/>
    <Clipboard/>
    <Modals/>
  </div>
);

App.propTypes = {
  children: React.PropTypes.object
};

export default App;
