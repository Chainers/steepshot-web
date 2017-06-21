import React from 'react';
import { getPosts } from '../actions/posts';
import PostItem from './Posts/Item';
import { connect } from 'react-redux';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: []
		};
	}

  componentDidMount() {
		let _this = this;

    getPosts().then((response) => {
      _this.setState({ posts: response});
		});
	}

	render() {
	  let postsComponent = <div>
      Loading
    </div>;

	  if (this.state.posts.length !== 0) {
      postsComponent = <div className="row">
        {
          this.state.posts.map((post) => {
            return <PostItem item={post} />
          })
        }
      </div>
    }
		return (
        <div className="container" id="all-posts">
          {postsComponent}
        </div>
		);
	}

}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Home);
