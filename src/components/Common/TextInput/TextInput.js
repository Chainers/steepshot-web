import React from 'react';
import utils from '../../../utils/utils';
import ShowIf from "../ShowIf";

class TextInput extends React.Component {
  static MARGIN_TEXT = 21;

  static defaultProps = {
    label: '',
    maxLength: 2048,
    multiline: true,
    maxHeight: 1000,
    required: false,
    smallFont: false,
    errorMsg: ''
  };

  state = {
    fontSize: this.props.smallFont ? 11 : 14,
    fontPadding: this.props.smallFont ? 7 : 9
  };

  constructor(props) {
    super(props);
  }

  onChange(event) {
    let newValue = event.target.value;
    if (!this.props.multiline) {
      newValue = newValue.replace('\n', '');
      this.input.value = newValue;
    }
    this.hiddenDiv.textContent = newValue + '\n';
    this.value = newValue;
    this.props.onChange(newValue);
  }

  get areaHeight() {
    let lineHeight = this.state.fontSize + this.state.fontPadding;
    let maxHeight = this.props.maxHeight - TextInput.MARGIN_TEXT;
    maxHeight = Math.round(maxHeight / lineHeight) * lineHeight;
    let height = this.hiddenDiv ? this.hiddenDiv.clientHeight : lineHeight;
    height = utils.getLess(height, maxHeight);
    return height;
  }

  render() {
    let focused = this.props.value || (this.input && this.input.value) ? 'focused_tex-inp' : '';
    let minAreaHeight = (this.state.fontSize + this.state.fontPadding) * 2;
    let prefAreaHeight = this.areaHeight;
    let paddingTop = prefAreaHeight < (minAreaHeight / 2 + 1) ? prefAreaHeight / 2 : 0;
    return (
      <div className="container_tex-inp" onClick={() => this.input.focus()}>
        <textarea className={'area_tex-inp input-text_tex-inp '}
                  onChange={this.onChange.bind(this)}
                  value={this.props.value}
                  maxLength={this.props.maxLength}
                  ref={ref => this.input = ref}
                  style={{
                    padding: paddingTop + 'px 0',
                    fontSize: this.state.fontSize + 'px',
                    height: prefAreaHeight,
                    minHeight: minAreaHeight
                  }}
        />
        <ShowIf show={utils.isNotEmptyString(this.props.errorMsg)}>
          <span className="error-msg_tex-inp">{this.props.errorMsg}</span>
        </ShowIf>
        <label className={'title_tex-inp ' + focused}>
          {this.props.title}
          <ShowIf show={this.props.required}>
            <span className="required_tex-inp"> *</span>
          </ShowIf>
        </label>
        <div className="hidden-div_tex-inp input-text_tex-inp"
             ref={ref => this.hiddenDiv = ref}
             style={{
               fontSize: this.state.fontSize + 'px',
               lineHeight: (this.state.fontSize + this.state.fontPadding) + 'px'
             }}
        >
          {this.props.value || ''}
        </div>
      </div>
    );
  }
}

export default TextInput;
