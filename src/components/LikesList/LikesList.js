import React from 'react';
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import {closeModal} from "../../actions/modal";
import UsersList from "../UsersList/UsersList";
import {getVoters} from "../../actions/posts";
import CloseButton from "../Common/CloseButton/CloseButton";
import {Scrollbars} from 'react-custom-scrollbars';
import {clearBodyHeight, setLikesListBodyHeight} from "../../actions/likesList";
import ReactResizeDetector from 'react-resize-detector';

class LikesModal extends React.Component {
  constructor(props) {
    super(props);
    this.updateBodyHeight = this.updateBodyHeight.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateBodyHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateBodyHeight);
    this.props.clearBodyHeight();
  }

  get permLink() {
    let urlObject = this.props.url.split('/');
    return `${urlObject[urlObject.length - 2]}/${urlObject[urlObject.length - 1]}`;
  }

  updateBodyHeight(width, height) {
    const HEADER_HEIGHT = 62;
    const PADDING_BOTTOM = 10;

    let fullBodyHeight = height ? height : this.props.fullBodyHeight;
    let preferredBodyHeight = window.innerHeight * 0.95 - HEADER_HEIGHT - PADDING_BOTTOM;
    preferredBodyHeight = fullBodyHeight > preferredBodyHeight ? preferredBodyHeight : fullBodyHeight;
    this.props.setBodyHeight(preferredBodyHeight, fullBodyHeight);
  }

  render() {
    return (
      <div className="container_lik-lis">
        <div className="header_lik-lis">
          <div className='title_lik-lis'>Post has been rated by these users</div>
          <CloseButton className='close-button_lik-lis' onClick={this.props.closeModal}/>
        </div>
        <Scrollbars style={{width: '100%', height: this.props.preferredBodyHeight}}>
          <UsersList
            point={`post/${this.permLink}/voters`}
            getUsers={getVoters}
            useScrollView={true}
          >
            <ReactResizeDetector handleWidth handleHeight onResize={this.updateBodyHeight} />
          </UsersList>
        </Scrollbars>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    url: state.posts[props.postIndex].url,
    ...state.likesList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal('LikesModal'));
    },
    setBodyHeight: (preferredBodyHeight, fullBodyHeight) => {
      dispatch(setLikesListBodyHeight(preferredBodyHeight, fullBodyHeight))
    },
    clearBodyHeight: (preferredBodyHeight, fullBodyHeight) => {
      dispatch(clearBodyHeight(preferredBodyHeight, fullBodyHeight))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LikesModal);
