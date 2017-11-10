import React from 'react';
import { 
    connect
} from 'react-redux';
import Constants from '../../common/constants';

class AvatarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...this.props 
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps
        })
    }

    render() {
        const stylesPic = {
            backgroundImage : 'url(' + this.state.src + ')'
        }
        const stylesError = {
            backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
        }
        return (
            <div className="pic" style={ stylesError }>
                <div className="pic" style={ stylesPic } >
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

export default connect(mapStateToProps)(AvatarComponent);
