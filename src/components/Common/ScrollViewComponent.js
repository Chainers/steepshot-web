import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';

const MARGIN_COMMENTS_AUTH = '82px';
const MARGIN_COMMENTS_NOT_AUTH = '0px';

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

    renderScrollbarContainer({style, ...props}) {
        let styles;
        if (this.props.isMobile) {
          styles = {...style};
        }
        return  <div className={this.state.scrollViewModifier || null} style={styles} {...props} />
    }

    render() {
        let marginControl = null, autoHeight;
        if (this.state.wrapperModifier === 'list-scroll_pos-mod') {
          if (this.state.isUserAuth) {
            marginControl = {marginBottom : MARGIN_COMMENTS_AUTH}
          } else {
            marginControl = {marginBottom : MARGIN_COMMENTS_NOT_AUTH}
          }
        }

        if (this.props.isMobile) {
          autoHeight = this.state.autoHeight;
        }

        return (
            <div className={this.state.wrapperModifier || null} style={marginControl} ref={ ref => {this.scrollFrame = ref} }>
                <Scrollbars
                    ref={(ref) => this.scrollBar = ref}
                    renderView={this.renderScrollbarContainer.bind(this)}
                    autoHeight={autoHeight}
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
