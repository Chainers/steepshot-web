import React from 'react';


class HeadingLeadComponent extends React.Component {
    static defaultProps = {
      wrapperModifier: ''
    };

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

export default HeadingLeadComponent;
