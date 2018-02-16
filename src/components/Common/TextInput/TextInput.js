import React from 'react';
import utils from '../../../utils/utils';
import ShowIf from "../ShowIf";
import ReactResizeDetector from 'react-resize-detector';
import {connect} from "react-redux";
import {initTextInput, setTextInputState} from "../../../actions/textInput";

class TextInput extends React.Component {
  static MARGIN_TEXT = 21;

  static defaultProps = {
    label: '',
    maxLength: 2048,
    multiline: true,
    maxHeight: 1000,
    required: false,
    smallFont: false,
    errorMsg: '',
    noValidCharacters: ''
  };

  constructor(props) {
    super(props);
    const fontSize = this.props.smallFont ? 11 : 14;
    const fontPadding = this.props.smallFont ? 7 : 9;
    const lineHeight = fontSize + fontPadding;
    let maxHeight = this.props.maxHeight - TextInput.MARGIN_TEXT;
    maxHeight = Math.round(maxHeight / lineHeight) * lineHeight;

    const state = {
      fontSize,
      fontPadding,
      lineHeight,
      areaPadding: lineHeight / 2,
      minAreaHeight: lineHeight * 2,
      prefAreaHeight: lineHeight,
      error: '',
      focused: this.props.value ? 'focused_tex-inp' : '',
      text: this.props.value,
      maxHeight
    };
    this.props.initTextInput(this.props.point, state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && (this.props.text !== nextProps.value)) {
      this._updateTextValue.call(this, nextProps.value);
    }
    return true;
  }

  onChange(event) {
    let newValue = utils.cloneObject(event.target.value);
    let lastCharCode = newValue.charCodeAt(newValue.length - 1);

    this._removeInvalidCharacters.call(this, newValue);
    if (newValue !== this.props.text) {
      this._updateTextValue.call(this, newValue);
    }
    this._callFunctionsFromProps.call(this, lastCharCode);
  }

  _removeInvalidCharacters(str) {
    let regExp = new RegExp(this.props.noValidCharacters);
    str.replace(regExp, '');
    if (!this.props.multiline) {
      str.replace('\n', '');
    }
  }

  _updateTextValue(newValue) {
    const focused = utils.isNotEmptyString(newValue) ? 'focused_tex-inp' : '';
    const state = {
      focused,
      text: newValue
    };
    this.props.setTextInputState(this.props.point, state);
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  _callFunctionsFromProps(lastCharCode) {
    if (this.props.keyPressEvents) {
      this.props.keyPressEvents.forEach(actionObj => {
        actionObj.keys.forEach(key => {
          if (key === lastCharCode) {
            actionObj.func();
          }
        })
      })
    }
  }

  resizeHiddenDiv() {
    let prefAreaHeight = this.hiddenDiv.clientHeight;
    let areaPadding = prefAreaHeight === this.props.lineHeight ? this.props.lineHeight / 2 : 0;
    const state = {
      prefAreaHeight,
      areaPadding
    };
    this.props.setTextInputState(this.props.point, state);
  }

  get areaModifier() {
    let areaModifier = this.props.error ? ' has-error_tex-inp' : '';
    return areaModifier + this.props.multiline ? ' multiline_tex-inp' : '';
  }

  render() {
    if (!this.props.fontSize) {
      return null;
    }

    return (
      <div className="container_tex-inp">
        <div className="input-container_tex-inp">
          <textarea className={'area_tex-inp input-text_tex-inp' + this.areaModifier}
                    onChange={this.onChange.bind(this)}
                    value={this.props.text}
                    maxLength={this.props.maxLength}
                    ref={ref => this.input = ref}
                    style={{
                      padding: this.props.areaPadding + 'px 0',
                      fontSize: this.props.fontSize + 'px',
                      height: this.props.prefAreaHeight,
                      minHeight: this.props.minAreaHeight
                    }}
          />
          <label className={'title_tex-inp ' + this.props.focused} onClick={() => this.input.focus()}>
            {this.props.title}
            <ShowIf show={this.props.required}>
              <span className="required_tex-inp"> *</span>
            </ShowIf>
          </label>
          <div className={'hidden-div_tex-inp' + this.areaModifier}
               ref={ref => this.hiddenDiv = ref}
               style={{
                 fontSize: this.props.fontSize + 'px',
                 lineHeight: this.props.lineHeight + 'px',
                 minHeight: this.props.lineHeight
               }}
          >
            {this.props.text + '\n'}
            <ReactResizeDetector handleWidth handleHeight onResize={this.resizeHiddenDiv.bind(this)}/>
          </div>
        </div>
        <ShowIf show={this.props.children}>
          <div className="children_tex-inp">
            {this.props.children}
          </div>
        </ShowIf>
        <ShowIf show={this.props.error}>
          <div className="error_tex-inp">
            {this.props.error}
          </div>
        </ShowIf>
        <ShowIf show={this.props.description}>
          <div className="description_tex-inp">
            {this.props.description}
          </div>
        </ShowIf>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {

  return {
    ...state.textInput[props.point]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initTextInput: (point, state) => {
      dispatch(initTextInput(point, state));
    },
    setTextInputState: (point, state) => {
      dispatch(setTextInputState(point, state));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
