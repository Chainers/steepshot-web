import React from 'react';
import {
  getPostComments
} from '../../actions/posts';
import Comment from './Comment';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: this.props.comment,
      comments: [],
      avatar: this.props.item.avatar,
      loading: true
    };
  }

  componentDidMount() {
    this.updatePostComments();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.comment.comment != nextProps.comment.comment) {
      this.state.comments.push(nextProps.comment.comment);

      this.setState({ 
        comments: this.state.comments,
        comment: nextProps.comment
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
    let _this = this;

    getPostComments(nextProps.item.author, nextProps.item.url).then((response) => {
      _this.setState({
        comments: response.results,
        loading: false,
        avatar: nextProps.item.avatar
      });
    });
  }

  render() {
    let _this = this;
    let comments = <div>No comments</div>;

    if (this.state.loading) {
      comments = <div>Loading...</div>;
    } 
    
    if (this.state.comments && this.state.comments.length != 0) {
      comments = this.state.comments.map((item, index) => {
        return <Comment key={index} item={item} />
      });
    }

    return (
      <div className="list-comments">
          {comments}
      </div>
    );
  }
}

Comments.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    posts: state.post,
    comment: state.comment
  };
};

export default connect(mapStateToProps)(Comments);
