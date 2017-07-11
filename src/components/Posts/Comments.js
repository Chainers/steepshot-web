import React from 'react';
import { Link } from 'react-router';
import { getPostComments } from '../../actions/posts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
    this.setState({ 
      comments: [],
      loading: true
     });

    this.updatePostComments(nextProps);
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

  setDefaultAvatar() {
    this.setState({ avatar: '/src/images/person.png' });
  }

  render() {
    let _this = this;
    let authorImage = this.state.avatar || '/src/images/person.png';
    const authorLink = `/userProfile/${this.props.item.author}`;
    let comments = <div>No comments</div>;

    if (this.state.loading) {
      comments = <div>Loading...</div>;
    } 
    
    if (this.state.comments && this.state.comments.length != 0) {
      comments = this.state.comments.map((item) => {
        return <div className="comment">
            <div>
                <img width="40px" height="40px" className="user-avatar" src={item.avatar} alt="Image" onError={this.setDefaultAvatar.bind(this)}/>
            </div>
            <div className="">
                <Link to={authorLink}><strong>{item.author}</strong></Link>
                <div className="comment-text">
                    {item.body}
                </div>
            </div>
        </div>
      });
    }

    return (
      <div className="comments-container">
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
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Comments);
