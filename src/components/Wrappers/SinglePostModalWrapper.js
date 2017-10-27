import React from 'react';
import {
    connect
} from 'react-redux';
import SinglePostModalComponent from '../Posts/SinglePostModalComponent';
import ModalComponent from '../Common/ModalComponent';

class SinglePostModalWrapper extends React.Component {
    render() {
        return(
            <ModalComponent>
                <SinglePostModalComponent {...this.props} />
            </ModalComponent>
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