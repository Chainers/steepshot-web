import React from 'react';
import {connect} from 'react-redux';
import {addSinglePost} from '../../../actions/post';
import PostModal from '../PostModal/PostModal';
import {logSharePost} from '../../../actions/logging';
import DocumentMeta from 'react-document-meta';

class SinglePost extends React.Component {
  constructor(props) {
    super(props);
    this.props.addSinglePost(this.props.location.pathname);
  }

  // componentWillMount() {
  //   logSharePost();
  // }

  render() {
    let itemPost, meta;
    if (Object.keys(this.props.post).length != 0) {
      itemPost = this.props.post[this.props.location.pathname.replace(/\/post/, '')];
      let arr = itemPost.title.split('');
      arr[0] = arr[0].toUpperCase();
      let username = this.props.location.pathname.match(/@\w+\//)[0];
      meta = {
        title: `${username.replace(/\//, '')}: «${arr.join('')}»` + ' | Steepshot',
        description: itemPost.description,
        canonical: itemPost.body,
        meta: {
          charset: 'utf-8',
          name: {
            keywords: 'steepshot, post, share'
          }
        }
      };
    }

    if (!this.props.currentIndex) return null;
    return (
      <div className="container_sin-pos">
        <DocumentMeta {...meta} />
        <div className="to-center_sin-pos">
          <PostModal showClose={false}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.postModal,
    post: {...state.posts}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSinglePost: url => {
      dispatch(addSinglePost(url));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePost);
