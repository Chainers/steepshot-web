import React from 'react';
import {connect} from 'react-redux';
import TextInput from "../Common/TextInput/TextInput";
import {
  addTag, changeImage, imageRotate, removeTag,
  setImageContainerSize
} from "../../actions/editPost";
import EditTags from "../Common/EditTags/EditTags";
import ShowIf from "../Common/ShowIf";
import utils from "../../utils/utils";
import constants from "../../common/constants";

class CreatePost extends React.Component {
  static  TAG_NAME = 'tag';
  static  DESCRIPTION_NAME = 'description';
  static  DESCRIPTION_MAX_LENGTH = 2048;
  static  MIN_PHOTO_WIDTH = 640;
  static  MIN_PHOTO_HEIGHT = 420;

  constructor(props) {
    super(props);
    this.setImageContainerSize = this.setImageContainerSize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image.rotate !== nextProps.image.rotate) {
      this.setImageContainerSize(nextProps.image.rotate);
    }
    return true;
  }

  imageChanged(event) {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      let image = new Image();
      image.src = reader.result;
      this.props.changeImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  setImageContainerSize(rotate) {
    const MIN_HEIGHT = 400;
    const MAX_WIDTH = utils.getLess(750, document.documentElement.clientWidth);

    let imgWidth = this.image.naturalWidth;
    let imgHeight = this.image.naturalHeight;
    if (rotate % 180 !== 0) {
      let tmp = imgWidth;
      imgWidth = imgHeight;
      imgHeight = tmp;
    }

    imgHeight = utils.getMore(imgHeight, MIN_HEIGHT);
    let prefHeight = document.documentElement.clientHeight;
    if (imgHeight < prefHeight) {
      prefHeight = imgHeight;
    }
    imgWidth = imgWidth * prefHeight / imgHeight;
    let prefWidth = imgWidth;
    if (prefWidth > MAX_WIDTH) {
      console.log(prefHeight);
      prefHeight = prefHeight * MAX_WIDTH / prefWidth;
      prefWidth = MAX_WIDTH;
      console.log(prefHeight);
    }

    this.props.setImageContainerSize(prefWidth, prefHeight);
  }

  render() {
    return (
      <div className='container_edi-pos'>
        <div className="image-container_edi-pos"
             style={{
               height: this.props.image.height,
             }}
        >
          <ShowIf show={utils.isEmptyString(this.props.image.src)}>
            <div className="choose-container_edi-pos">
              <div className="upload-icon_edi-pos"/>
              <span className="upload-text_edi-pos">
                Click to upload a picture
              </span>
            </div>
          </ShowIf>
          <ShowIf show={utils.isNotEmptyString(this.props.image.src)}>
            <img className="image_edi-pos"
                 src={this.props.image.src}
                 style={{
                   transform: `rotate(${this.props.image.rotate}deg)`,
                   maxHeight: this.props.image.rotate % 180 ? this.props.image.width : '100vh',
                   maxWidth: this.props.image.rotate % 180 ? '100vh' : this.props.image.width,
                 }}
                 alt='image'
                 ref={ref => this.image = ref}
                 onLoad={() => this.setImageContainerSize(0)}
            />

          </ShowIf>
          <div className="rotate-button_edi-pos" onClick={this.props.imageRotate}/>
          <input className="file-input_edi-pos"
                 type="file"
                 onChange={this.imageChanged.bind(this)}/>
        </div>
        <div className="title_edi-pos">
          <TextInput title="Title"
                     point={constants.TEXT_INPUT_POINT.TITLE}
                     multiline={false}
                     required={true}
                     value={this.props.title.text}
                     error={this.props.title.error}
                     maxLength={255}/>
          <TextInput title="Tags"
                     point={constants.TEXT_INPUT_POINT.TAGS}
                     multiline={false}
                     description="Enter tags with spaces, but not more than 20"
                     error={this.props.tags.error}
                     noValidCharacters="[^\w]"
                     keyPressEvents={[{
                       keys: [constants.KEYS.SPACE, constants.KEYS.ENTER],
                       func: () => this.props.addTag()
                     }]}>
            <EditTags value={this.props.tags.current}
                      onChange={() => this.props.removeTag()}/>
          </TextInput>
          <TextInput title="Description"
                     point={constants.TEXT_INPUT_POINT.DESCRIPTION}
                     multiline={true}
                     maxHeight={50000}
                     value={this.props.description}
                     description="Description is limited to 2048 characters"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.editPost
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: () => {
      dispatch(addTag())
    },
    removeTag: (index) => {
      dispatch(removeTag(index))
    },
    changeImage: (image) => {
      dispatch(changeImage(image))
    },
    imageRotate: () => {
      dispatch(imageRotate())
    },
    setImageContainerSize: (width, height) => {
      dispatch(setImageContainerSize(width, height))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
