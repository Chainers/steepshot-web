import React from 'react';
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import {closeModal} from "../../actions/modal";
import UsersList from "../UsersList/UsersList";
import {getVoters} from "../../actions/posts";
import CloseButton from "../Common/CloseButton/CloseButton";
import {Scrollbars} from 'react-custom-scrollbars';
import {clearBodyHeight, setLikesFlagsListBodyHeight} from "../../actions/likesFlagsList";
import ReactResizeDetector from 'react-resize-detector';
import TabsBar from "../Common/TabsBar/TabsBar";
import Tab from "../Common/TabsBar/Tab/Tab";
import utils from '../../utils/utils';

class LikesFlagsModal extends React.Component {
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

  componentDidUpdate() {
    let currentBody = this.props.activeIndex ? this.flags : this.likes;
    this.updateBodyHeight(undefined, currentBody.state.lastHeight);
  }

  static permLink(url) {
    let urlObject = url.split('/');
    return `${urlObject[urlObject.length - 2]}/${urlObject[urlObject.length - 1]}`;
  }

  updateBodyHeight(width, height) {
    const HEADER_HEIGHT = 48;
    const PADDING_BOTTOM = 10;

    let fullBodyHeight = height ? height : this.props.fullBodyHeight;
    let preferredBodyHeight = window.innerHeight * 0.95 - HEADER_HEIGHT - PADDING_BOTTOM;
    preferredBodyHeight = utils.getLess(preferredBodyHeight, fullBodyHeight);
    if (this.props.preferredBodyHeight !== preferredBodyHeight) {
      this.props.setBodyHeight(preferredBodyHeight, fullBodyHeight);
    }
  }

  render() {
    return (
      <div className={(this.props.hasOneUser ? 'has-one_lik-lis' : '') + ' container_lik-lis'}>
        <CloseButton className='close-button_lik-lis' onClick={this.props.closeModal}/>
        <TabsBar point="likesFlags"
                 showLoader={false}>
          <Tab name="Likes">
            <Scrollbars style={{width: '100%', height: this.props.preferredBodyHeight}}>
              <UsersList
                point={this.props.point}
                getUsers={getVoters}
                useScrollView={true}
                options={{likes: 1}}
              >
                <ReactResizeDetector handleWidth handleHeight onResize={this.updateBodyHeight} ref={ref => this.likes = ref}/>
              </UsersList>
            </Scrollbars>
          </Tab>
          <Tab name="Flags">
            <Scrollbars style={{width: '100%', height: this.props.preferredBodyHeight}}>
              <UsersList
                point={this.props.point}
                getUsers={getVoters}
                useScrollView={true}
                options={{flags: 1}}
              >
                <ReactResizeDetector handleWidth handleHeight onResize={this.updateBodyHeight} ref={ref => this.flags = ref}/>
              </UsersList>
            </Scrollbars>
          </Tab>
        </TabsBar>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let point = `post/${LikesFlagsModal.permLink(state.posts[props.postIndex].url)}/voters`;
  return {
    hasOneUser: state.usersList[point] && state.usersList[point].users.length === 1,
    point,
    ...state.likesFlagsList,
    ...state.tabsBar.likesFlags
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(closeModal('LikesFlagsModal'));
    },
    setBodyHeight: (preferredBodyHeight, fullBodyHeight) => {
      dispatch(setLikesFlagsListBodyHeight(preferredBodyHeight, fullBodyHeight))
    },
    clearBodyHeight: (preferredBodyHeight, fullBodyHeight) => {
      dispatch(clearBodyHeight(preferredBodyHeight, fullBodyHeight))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LikesFlagsModal);
