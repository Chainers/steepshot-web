import React from 'react';
import { getComments } from '../../services/posts';
import Comment from './Comment';
import { connect } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      avatar: this.props.item.avatar,
      loading: true
    };
  }

  componentDidMount() {
    this.updatePostComments();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newComment !== undefined) {
      this.state.comments.push(nextProps.newComment);
      this.setState({
        comments: this.state.comments,
      });
    } else {
      this.setState({
        comments: [],
        loading: true
      });

      this.updatePostComments(nextProps);
    }
  }

  updatePostComments(nextProps) {
    nextProps = nextProps || this.props;
    const options = {
      point : `post/${nextProps.item.author}/${nextProps.item.url}/comments`,
      params : {}
    };
    getComments(options, true).then((response) => {
      this.setState({
        comments: response.results,
        loading: false,
        avatar: nextProps.item.avatar
      });
    });
  }


  render() {
    let comments = null;

    if (this.state.loading) {
      comments = <LoadingSpinner style={{marginTop: 20}}/>;
    }
    if (this.state.comments && this.state.comments.length !== 0) {
      comments = this.state.comments.map((item, index) => {
        return <Comment replyUser={this.props.replyUser} key={index} item={item} />
      });
    }
    return (
      <div className="list-comments">
          {comments}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    posts: state.post,
    comment: state.comment
  };
};

export default connect(mapStateToProps)(Comments);
