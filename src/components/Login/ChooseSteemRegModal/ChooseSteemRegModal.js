import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal} from '../../../actions/modal';
import './chooseSteemRegModal.css';

class ChooseSteemRegModal extends React.Component {

  render() {
    let variantsArr = [
      {registrationService: 'Steemit', registrationServiceImage: '/images/chooseSteemRegModal/steem.png',
        linkToRegistrationService: 'https://signup.steemit.com', free: true, instant: false},
      {registrationService: 'Blocktrades', registrationServiceImage: '/images/chooseSteemRegModal/blocktrades.png',
        linkToRegistrationService: 'https://blocktrades.us/create-steem-account', free: false, instant: true},
      {registrationService: 'SteemCreate', registrationServiceImage: '/images/chooseSteemRegModal/steemcreate.png',
        linkToRegistrationService: 'http://steemcreate.com', free: false, instant: true}
      ];
    let registrationVariants = variantsArr.map( (item, index) => {
      return <div className="reg-service_choose-steem-reg-mod" key={index}>
                <a href={item.linkToRegistrationService} target="_blank" rel="noopener noreferrer">
                  <div className="reg-service-logo_choose-steem-reg-mod"
                       style={{backgroundImage: `url(${item.registrationServiceImage})`}}/>
                </a>
                <p className="reg-service-name_choose-steem-reg-mod">Register through {item.registrationService}</p>
                <p className="reg-service-params_choose-steem-reg-mod">
                  {item.free ? 'free' : 'chargeable'}, {item.instant ? 'instant' : 'not instant'}
                </p>
             </div>
    });

    return (
      <div className="wrapper_choose-steem-reg-mod">
        <p className="title_choose-steem-reg-mod">Choose a way to create Steem account.</p>
        <div className="reg-services-items_choose-steem-reg-mod">
          {registrationVariants}
        </div>
        <div className="buttons_choose-steem-reg-mod">
          <button className="btn btn-index" onClick={() => this.props.closeModal()}>CANCEL</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal("ChooseSteemRegModal"));
    }
  }
};

export default connect(() => {return {}}, mapDispatchToProps)(ChooseSteemRegModal);
