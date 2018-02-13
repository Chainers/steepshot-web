import React from 'react';
import utils from '../../../utils/utils';
import ShowIf from "../ShowIf";

class TextInput extends React.Component {
  static LINE_HEIGHT = 25;
  static MARGIN_TOP = 21;
  static FONT_PADDING = 5;

  static defaultProps = {
    label: '',
    maxLength: 2048,
    multiline: true,
    maxHeight: 1000,
    required: false,
    style: {}
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
    this.props.onChange();
  }

  get areaHeight() {
    let lineHeight = this.props.style.fontSize + TextInput.FONT_PADDING || TextInput.LINE_HEIGHT;
    let areaHeight = this.hiddenDiv ?
      utils.getLess(this.hiddenDiv.clientHeight, this.props.maxHeight - TextInput.MARGIN_TOP) : lineHeight;
    areaHeight = utils.getMore(areaHeight, lineHeight);
    areaHeight = Math.round(areaHeight / lineHeight) * lineHeight;
    return areaHeight;
  }

  render() {
    let focused = this.props.value || (this.input && this.input.value) ? 'focused_tex-inp' : '';
    return (
      <div className="container_tex-inp" onClick={() => this.input.focus()}>
        <textarea className="area_tex-inp input-text_tex-inp"
                  onChange={this.onChange.bind(this)}
                  value={this.props.value}
                  maxLength={this.props.maxLength}
                  ref={ref => this.input = ref}
                  style={{...this.props.style,
                    height: this.areaHeight,
                    lineHeight: (this.props.style.fontSize + TextInput.FONT_PADDING || TextInput.LINE_HEIGHT) + 'px'
                  }}
        />
        <label className={'title_tex-inp ' + focused}>
          {this.props.title}
          <ShowIf show={this.props.required}>
            <span className="required_tex-inp"> *</span>
          </ShowIf>
        </label>
        <div className="hidden-div_tex-inp input-text_tex-inp"
             style={{...this.props.style,
               height: undefined,
               lineHeight: (this.props.style.fontSize + TextInput.FONT_PADDING || TextInput.LINE_HEIGHT) + 'px'
             }}
             ref={ref => this.hiddenDiv = ref}>
          {this.props.value || ''}
        </div>
      </div>
    );
  }
}

export default TextInput;
