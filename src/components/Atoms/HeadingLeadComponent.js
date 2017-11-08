import React from 'react';
import { 
    connect
} from 'react-redux';

class HeadingLeadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...this.props 
        };
    }

    componentWillreceiveProps(nextProps) {
        this.setState({
            ...nextProps
        })
    }

    render() {
        const {
            wrapperModifier,
            text
        } = { ...this.state };
        return (
            <div className={"heading-lead " + wrapperModifier}>
                <p>{text}</p>
                <hr />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(HeadingLeadComponent);
