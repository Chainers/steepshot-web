import React from 'react';
import {connect} from 'react-redux';
import TextInput from "../Common/TextInput/TextInput";
import {
  addTag, changeImage, createPost, editPostClear, imageRotate, removeTag, setImageContainerSize,
  setInitDataForEditPost
} from "../../actions/editPost";
import EditTags from "../Common/EditTags/EditTags";
import ShowIf from "../Common/ShowIf";
import utils from "../../utils/utils";
import constants from "../../common/constants";
import LoadingSpinner from "../LoadingSpinner";

class EditPost extends React.Component {
  static  TAG_NAME = 'tag';
  static  DESCRIPTION_NAME = 'description';
  static  DESCRIPTION_MAX_LENGTH = 2048;
  static  MIN_PHOTO_WIDTH = 640;
  static  MIN_PHOTO_HEIGHT = 420;

  constructor(props) {
    super(props);
    this.setImageContainerSize = this.setImageContainerSize.bind(this);
    this.props.setInitDataForEditPost(this.props.username, this.props.postId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rotate !== nextProps.rotate) {
      this.setImageContainerSize(nextProps.rotate);
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
      image.onload = () => {
        this.props.changeImage(reader.result, image);
      }
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

  submit() {
    if (this.props.username && this.props.postId) {

    } else {
      this.props.createPost()
    }
  }

  render() {

    return (
      <div className={'container_edi-pos ' + (this.props.loading ? 'blur-blocker' : '')}>
        <ShowIf show={this.props.loading}>
          <LoadingSpinner style={{height: '100%', position: 'absolute'}}/>
        </ShowIf>
        <div className="image-container_edi-pos"
             style={{
               height: this.props.height,
             }}
        >
          <ShowIf show={utils.isEmptyString(this.props.src)}>
            <div className="choose-container_edi-pos">
              <div className="upload-icon_edi-pos"/>
              <span className="upload-text_edi-pos">
                Click to upload a picture
              </span>
            </div>
          </ShowIf>
          <ShowIf show={utils.isNotEmptyString(this.props.src)}>
            <img className="image_edi-pos"
                 src={this.props.src}
                 style={{
                   transform: `rotate(${this.props.rotate}deg)`,
                   maxHeight: this.props.rotate % 180 ? this.props.width : '100%',
                   maxWidth: this.props.rotate % 180 ? '100%' : this.props.width,
                 }}
                 alt='image'
                 ref={ref => this.image = ref}
                 onLoad={() => this.setImageContainerSize(0)}
            />
            <div className="rotate-button_edi-pos"
                 onClick={() => this.props.imageRotate(this.image)}/>
          </ShowIf>
          <input className="file-input_edi-pos"
                 type="file"
                 onChange={this.imageChanged.bind(this)}/>
        </div>
        <ShowIf show={this.props.imageError}>
          <div className="image-error_edi-pos">
            {this.props.imageError}
          </div>
        </ShowIf>
        <TextInput title="Title"
                   point={constants.TEXT_INPUT_POINT.TITLE}
                   multiline={false}
                   required={true}
                   value={this.props.initData.title}
                   maxLength={255}/>
        <TextInput title="Tags"
                   point={constants.TEXT_INPUT_POINT.TAGS}
                   multiline={false}
                   description="Enter tags with spaces, but not more than 20"
                   noValidCharacters="[^\w]"
                   keyPressEvents={[{
                     keys: [constants.KEYS.SPACE, constants.KEYS.ENTER],
                     func: () => this.props.addTag()
                   }]}>
          <EditTags value={this.props.tags}
                    onChange={() => this.props.removeTag()}/>
        </TextInput>
        <TextInput title="Description"
                   point={constants.TEXT_INPUT_POINT.DESCRIPTION}
                   multiline={true}
                   maxHeight={50000}
                   value={this.props.initData.description}
                   description="Description is limited to 2048 characters"/>
        <div className="buttons-container_edi-pos">
          <button onClick={this.props.editPostClear}
                  className="btn btn-index">Clear
          </button>
          <button onClick={this.submit.bind(this)}
                  className="btn btn-default">{this.props.url ? 'Update post' : 'Create new post'}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...props.match.params,
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
    changeImage: (imageSrc, image) => {
      dispatch(changeImage(imageSrc, image))
    },
    imageRotate: (image) => {
      dispatch(imageRotate(image))
    },
    setImageContainerSize: (width, height) => {
      dispatch(setImageContainerSize(width, height))
    },
    setInitDataForEditPost: (username, postId) => {
      dispatch(setInitDataForEditPost(username, postId))
    },
    editPostClear: () => {
      dispatch(editPostClear())
    },
    createPost: () => {
      dispatch(createPost())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
