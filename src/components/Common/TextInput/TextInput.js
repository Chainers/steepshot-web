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
    errorMsg: '',
    noValidCharacters: ''
  };

  state = {
    fontSize: this.props.smallFont ? 11 : 14,
    fontPadding: this.props.smallFont ? 7 : 9,
    error: this.props.error
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (utils.equalsObject(this.props, nextProps)) {
      return false;
    }
    return true;
  }

  onChange(event) {
    let newValue = event.target.value;
    let regExp = new RegExp(this.props.noValidCharacters);
    newValue = newValue.replace(regExp, '');
    if (!this.props.multiline) {
      newValue = newValue.replace('\n', '');
      this.input.value = newValue;
    }
    if (newValue !== event.target.value) {
      this.input.value = newValue;
      return;
    }
    if (this.state.error) {
      this.setState({error: undefined})
    }
    this.hiddenDiv.textContent = newValue + '\n';
    this.value = newValue;
    console.log("tyt");
    this.props.onChange(newValue);
  }

  get areaHeight() {
    let lineHeight = this.state.fontSize + this.state.fontPadding;
    let maxHeight = this.props.maxHeight - TextInput.MARGIN_TEXT;
    maxHeight = Math.round(maxHeight / lineHeight) * lineHeight;
    let height = this.hiddenDiv && this.hiddenDiv.clientHeight ? this.hiddenDiv.clientHeight : lineHeight;
    height = utils.getLess(height, maxHeight);
    return height;
  }

  render() {
    let focused = this.props.value || (this.input && this.input.value) ? 'focused_tex-inp' : '';
    let minAreaHeight = (this.state.fontSize + this.state.fontPadding) * 2;
    let prefAreaHeight = this.areaHeight;
    let paddingTop = prefAreaHeight < (minAreaHeight / 2 + 1) ? prefAreaHeight / 2 : 0;
    return (
      <div className="container_tex-inp">
        <div className="input-container_tex-inp">
        <textarea className={'area_tex-inp input-text_tex-inp ' + (this.state.error ? 'has-error_tex-inp' : '')}
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
          <label className={'title_tex-inp ' + focused} onClick={() => this.input.focus()}>
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
        <ShowIf show={this.props.children}>
          <div className="children_tex-inp">
            {this.props.children}
          </div>
        </ShowIf>
        <ShowIf show={this.state.error}>
          <div className="error_tex-inp">
            {this.state.error}
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

export default TextInput;
