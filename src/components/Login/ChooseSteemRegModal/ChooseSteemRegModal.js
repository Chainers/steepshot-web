import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal} from '../../../actions/modal';
import './chooseSteemRegModal.css';
import {setLinkToService} from '../../../actions/chooseSteemRegModal';

class ChooseSteemRegModal extends React.Component {

  goToRegService() {
    if (this.props.linkToService) {
      window.open(this.props.linkToService);
    }
  }

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
                <div className="reg-service-logo_choose-steem-reg-mod"
                     style={{backgroundImage: `url(${item.registrationServiceImage})`,
                       border: this.props.serviceIndex === index ? '1px solid #e74800' : ''}}
                     onClick={() => this.props.setLinkToService(index, item.linkToRegistrationService)}/>
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
          <button className="btn btn-default" onClick={this.goToRegService.bind(this)}>GO TO</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.chooseSteemRegModal
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal("ChooseSteemRegModal"));
    },
    setLinkToService: (index, link) => {
      dispatch(setLinkToService(index, link));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSteemRegModal);
