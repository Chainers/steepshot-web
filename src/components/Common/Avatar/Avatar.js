import React from 'react';
import {
    connect
} from 'react-redux';
import Constants from '../../../common/constants';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const stylesPic = {
            backgroundImage : 'url(' + this.props.src + ')'
        };
        const stylesError = {
            backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
        };
        return (
            <div className="pic_ava-com" style={ stylesError }>
                <div className="pic_ava-com" style={ stylesPic } >
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Avatar);
