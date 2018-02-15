import React from 'react';
import {connect} from 'react-redux';
import TextInput from "../Common/TextInput/TextInput";
import {changeDescription, changeImage, addTag, changeTitle, removeTag} from "../../actions/editPost";
import EditTags from "../Common/EditTags/EditTags";
import ShowIf from "../Common/ShowIf";
import utils from "../../utils/utils";

class CreatePost extends React.Component {
  static  TAG_NAME = 'tag';
  static  DESCRIPTION_NAME = 'description';
  static  DESCRIPTION_MAX_LENGTH = 2048;
  static  MIN_PHOTO_WIDTH = 640;
  static  MIN_PHOTO_HEIGHT = 420;

  constructor(props) {
    super(props);

  }

  imageChanged(event) {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      this.props.changeImage(reader.result)
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className='container_edi-pos'>
        <div className="image-container_edi-pos">
          <ShowIf show={utils.isEmptyString(this.props.image.src)}>
            <div className="choose-container_edi-pos">
              <div className="upload-icon_edi-pos"/>
              <span className="upload-text_edi-pos">
                Click to upload a picture
              </span>
            </div>
          </ShowIf>
          <ShowIf show={utils.isNotEmptyString(this.props.image.src)}>
            <img className="image_edi-pos" src={this.props.image.src} alt='image'/>
          </ShowIf>
          <input className="file-input_edi-pos"
                 type="file"
                 onChange={this.imageChanged.bind(this)}/>
        </div>
        <div className="title_edi-pos">
          <TextInput title="Title"
                     multiline={false}
                     required={true}
                     value={this.props.title.text}
                     error={this.props.title.error}
                     maxLength={255}
                     onChange={(value) => this.props.changeTitle(value)}/>
          <TextInput title="Tabs"
                     multiline={true}
                     value={this.props.tags.current}
                     description="Enter tags with spaces, but not more than 20"
                     error={this.props.tags.error}
                     noValidCharacters="[^\n\s\w]"
                     onChange={(value) => this.props.addTag(value)}>
            <EditTags value={this.props.tags.text}
                      onChange={(value) => this.props.removeTag(value)}/>
          </TextInput>
          <TextInput title="Description"
                     multiline={true}
                     maxHeight={50000}
                     description="Description is limited to 2048 characters"
                     noValidCharacters="[^\n\s\w]"
                     onChange={(value) => this.props.changeDescription(value)}/>
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
    changeTitle: (value) => {
      dispatch(changeTitle(value));
    },
    addTag: (value) => {
      dispatch(addTag(value))
    },
    changeDescription: (value) => {
      dispatch(changeDescription(value))
    },
    changeImage: (image) => {
      dispatch(changeImage(image))
    },
    removeTag: (index) => {
      dispatch(removeTag(index))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
