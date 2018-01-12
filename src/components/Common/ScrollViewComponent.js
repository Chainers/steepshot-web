import React from 'react';
import ReactDOM from 'react-dom';

import { Scrollbars } from 'react-custom-scrollbars';

class ScrollViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          ...this.props
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps
        })
    }

    setHeightForWrapper() {
        let $target = $(ReactDOM.findDOMNode(this.refs.scrollFrame));
        $target.css('height', $target.height());
    }

    renderScrollbarContainer({ style, ...props }) {
        return  <div className={this.state.scrollViewModifier || null} style={{...style}} {...props} />
    }

    render() {
        let marginControl = null;
        if (this.state.wrapperModifier == 'list-scroll') {
          if (this.state.isUserAuth) {
            marginControl = {marginBottom : '82px'}
          } else {
            marginControl = {marginBottom : '0'}
          }
        }

        return (
            <div className={this.state.wrapperModifier || null} style={marginControl} ref={ ref => {this.scrollFrame = ref} }>
                <Scrollbars
                    ref={(ref) => this.scrollBar = ref}
                    renderView={this.renderScrollbarContainer.bind(this)}
                    autoHeight={this.state.autoHeight}
                    autoHeightMin={this.state.autoHeightMin}
                    autoHeightMax={this.state.autoHeightMax}
                    autoHide={this.state.autoHide}
                    onUpdate={this.state.autoHeight ? null : this.setHeightForWrapper.bind(this)}
                >
                    {this.state.children}
                </Scrollbars>
            </div>
        )
    }
}

export default ScrollViewComponent;
