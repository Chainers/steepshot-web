import React from 'react';
import {
    connect
} from 'react-redux';
import SinglePostModalComponent from '../Posts/SinglePostModalComponent';
import ModalComponent from '../Common/ModalComponent';
import LoadingSpinner from '../LoadingSpinner';

class SinglePostModalWrapper extends React.Component {
    render() {
        return(
            <div>
                <div className="block--center">
                    <h1> Loading </h1>
                    <div className="position--relative">
                        <LoadingSpinner />
                    </div>
                </div>
                <ModalComponent>
                    <SinglePostModalComponent {...this.props} />
                </ModalComponent>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization,
    search: state.search,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(SinglePostModalWrapper);