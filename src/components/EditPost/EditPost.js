import React from 'react';
import {connect} from 'react-redux';
import TextInput from "../Common/TextInput/TextInput";
import {changeDescription, changeTags, changeTitle} from "../../actions/editPost";

class CreatePost extends React.Component {
  static  TAG_NAME = 'tag';
  static  DESCRIPTION_NAME = 'description';
  static  DESCRIPTION_MAX_LENGTH = 2048;
  static  MIN_PHOTO_WIDTH = 640;
  static  MIN_PHOTO_HEIGHT = 420;

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='container_edi-pos'>
        <div className="image-container_edi-pos">
          <div className="upload-icon_edi-pos"/>
          <span className="upload-text_edi-pos">
            Click to upload a picture
          </span>
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
                     multiline={false}
                     value={this.props.tags.text}
                     description="Enter tags with spaces, but not more than 20"
                     error={this.props.tags.error}
                     noValidCharacters="[^\n\s\w]"
                     onChange={(value) => this.props.changeTags(value)}>
          </TextInput>
          <TextInput title="Description"
                     multiline={true}
                     maxHeight={500}
                     value={this.props.description}
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
    changeTags: (value) => {
      dispatch(changeTags(value))
    },
    changeDescription: (value) => {
      dispatch(changeDescription(value))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
