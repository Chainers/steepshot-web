import React from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactResizeDetector from 'react-resize-detector';
import {scrollInit, scrollShouldUpdate, shouldFetch} from '../../actions/scroll';
import './scroll.css';

class Scroll extends React.Component {

    constructor(props) {
        super();
        props.scrollInit(props.point);
    }

    onScrollFrame(values) {
        const {shouldFetch, shouldUpdate, point, deltaForFetch} = this.props;
        if (shouldFetch === shouldUpdate && values.scrollHeight - values.scrollTop < deltaForFetch) {
            this.props.shouldFetchFunc(point);
        }
    }

    update() {
        this.scroll.update();
        this.props.scrollShouldUpdate(this.props.point);
    }

    render() {
        const {children, customScrollStyle} = this.props;
        return (
            <Scrollbars onScrollFrame={this.onScrollFrame.bind(this)}
                        ref={ref => this.scroll = ref}
                        style={this.props.style}
                        renderTrackVertical={() => {
                            return (<div className={'default_scroll ' + (customScrollStyle || '')}/>)
                        }}>
                <div className={this.props.className}>
                    {children}
                    <ReactResizeDetector handleWidth handleHeight onResize={this.update.bind(this)}/>
                </div>
            </Scrollbars>
        );
    }
}

Scroll.defaultProps = {
    deltaForFetch: 0
};

const mapStateToProps = (state, props) => {
    const {shouldUpdate, shouldFetch} = state.scroll[props.point];
    return {
        shouldUpdate,
        shouldFetch
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        scrollInit: point => {
            dispatch(scrollInit(point))
        },
        scrollShouldUpdate: point => {
            dispatch(scrollShouldUpdate(point))
        },
        shouldFetchFunc: (point) => {
            dispatch(shouldFetch(point))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scroll);
