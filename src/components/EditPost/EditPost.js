import React from 'react';
import {connect} from 'react-redux';
import TextInput from "../Common/TextInput/TextInput";
import {addTag, changeImage, createPost, editClearAll, editPost, editPostClear, imageNotFound, imageRotate, removeTag,
  setImageContainerSize, setInitDataForEditPost} from "../../actions/editPost";
import EditTags from "../Common/EditTags/EditTags";
import ShowIf from "../Common/ShowIf";
import utils from "../../utils/utils";
import constants from "../../common/constants";
import LoadingSpinner from "../LoadingSpinner";
import {documentTitle} from "../../components/DocumentTitle";

class EditPost extends React.Component {

  constructor(props) {
    super(props);
    this.setImageContainerSize = this.setImageContainerSize.bind(this);
    this.props.setInitDataForEditPost(this.props.username, this.props.postId);
  }

  componentWillReceiveProps(nextProps) {
    documentTitle();
    if (this.props.postId !== nextProps.postId) {
      this.props.setInitDataForEditPost(nextProps.username, nextProps.postId);
    }
    if (this.props.rotate !== nextProps.rotate) {
      this.setImageContainerSize(nextProps.rotate);
    }
    return true;
  }

  componentWillUnmount() {
    this.props.editClearAll();
  }

  componentDidMount() {
    documentTitle();
  }

  imageChanged(event) {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    Object.defineProperty(file, 'name', {
      writable: true
    });
    file.name = `${file.lastModified}-${file.size}-${file.type.replace(/\//, '.')}`;
    reader.onloadend = () => {
      let image = new Image();
      image.src = reader.result;
      image.onload = () => {
        this.props.changeImage(reader.result, image, file.size);
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
      prefHeight = prefHeight * MAX_WIDTH / prefWidth;
      prefWidth = MAX_WIDTH;
    }

    this.props.setImageContainerSize(prefWidth, prefHeight);
  }

  submit() {
    if (this.props.isNew) {
      this.props.createPost()
    } else {
      this.props.editPost()
    }
  }

  render() {
    return (
      <div className="wrapper_edi-pos">
        <ShowIf show={this.props.loading}>
          <LoadingSpinner style={{height: '100%', position: 'absolute'}}/>
        </ShowIf>
        <div className={'container_edi-pos ' + (this.props.loading ? 'blur-blocker' : '')}>
          <div className="image-container_edi-pos"
               style={{
                 height: this.props.height,
                 cursor: this.props.isNew ? 'pointer' : 'default'
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
                   onError={this.props.setImageNotFound}
              />
              <ShowIf show={this.props.isNew}>
                <div className="rotate-button_edi-pos"
                     onClick={() => this.props.imageRotate(this.image)}/>
              </ShowIf>
              <ShowIf show={this.props.imageNotFound}>
                <div className="img-not-found_edi-pos">
                  <p className="img-not-found-text_edi-pos">Sorry, image isn't found.</p>
                </div>
              </ShowIf>
            </ShowIf>
            <ShowIf show={this.props.isNew}>
              <input className="file-input_edi-pos"
                     type="file"
                     onChange={this.imageChanged.bind(this)}
              />
            </ShowIf>
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
                     noValidCharacters="[А-Яа-я]"
                     maxLength={255}/>
          <TextInput title="Tags"
                     maxLength={20}
                     point={constants.TEXT_INPUT_POINT.TAGS}
                     multiline={false}
                     description="Enter tags with spaces, but not more than 20"
                     noValidCharacters="[^A-Za-z0-9]"
                     keyPressEvents={[{
                       keys: [constants.KEYS.SPACE, constants.KEYS.ENTER],
                       func: () => this.props.addTag()
                     }]}>
            <EditTags value={this.props.tags}
                      onChange={this.props.removeTag}/>
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
                    className="btn btn-default" disabled={this.props.canNotUpdate}>
              {this.props.isNew ? 'Create new post' : 'Update post'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {postId} = props.match.params;
  return {
    postId,
    username: state.auth.user,
    ...state.editPost,
    canNotUpdate: state.editPost.initData.canNotUpdate
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
    changeImage: (imageSrc, image, fileSize) => {
      dispatch(changeImage(imageSrc, image, fileSize))
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
    editClearAll: () => {
      dispatch(editClearAll())
    },
    createPost: () => {
      dispatch(createPost())
    },
    editPost: () => {
      dispatch(editPost())
    },
    setImageNotFound: () => {
      dispatch(imageNotFound())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
