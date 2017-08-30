import React from 'react';
import { 
    Link, 
    Redirect 
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PopoupFollowItem from './popoutFollowItem';
import LoadingSpinner from '../LoadingSpinner';
import InfiniteScroll from '../Scroller/infinityScroll';

class PopoutFollow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          items: [],
          requestKey: this.props.requestKey,
          followCallback: this.props.followCallback,
          hasMore: true,
          offset: null,
          loading: true
        };
    }

    componentDidMount() {
      let _this = this;

      this.state.followCallback(this.state.requestKey).then((response) => {
        let newItems = this.state.items.concat(response.results);

        _this.setState({ 
          items: newItems, 
          offset: response.offset
        });
      });
    }

    fetchData() {
      let _this = this;
  
      this.state.followCallback(this.state.requestKey, this.state.offset).then((response) => {
        this.state.items.pop();
        let newItems = this.state.items.concat(response.results);
  
        if (response.count < 20 || !response.offset) {
          _this.setState({
            items: newItems, 
            offset: response.offset, 
            hasMore: false
          });
        } else {
          _this.setState({ 
            items: newItems, 
            offset: response.offset
          });
        }
      });
    }

    render() {
      let items = [];
      let renderElements = <div className='loading-block'><LoadingSpinner /></div>;
      
      if (!this.state.loading && this.state.items.length == 0) {
        renderElements = <div className='loading-block'><br /><h4>No find results for '{this.props.search.value}' filter</h4></div>;
      }
  
      if (this.state.items.length > 0) {
        this.state.items.map((item, index) => {
          items.push(<PopoupFollowItem item={item} />);
        });
  
        renderElements = <InfiniteScroll
            next={this.fetchData.bind(this)}
            hasMore={this.state.hasMore}
            loader={<div className='loading-block'>
                <LoadingSpinner />
              </div>
            }
            endMessage={
              <p className='loading-block'>
                <b>Yay! You have seen it all</b>
              </p>
            }>
            <div className="popup-follow-body">
            {items}
            </div>
          </InfiniteScroll>;
      }

      return(
          <div id="popup" className="custom-follow-popup">
          <div className="my-modal">
            <div className="popup-header">
              <div className="popup-title">
                {this.props.title}
              </div>
              <button type="button" className="close col-lg-1 col-md-1 col-sm-1 col-xs-1"
                      onClick={this.props.closeModal}>&times;</button>
            </div>
            <div className="popup-follow-body">
              { renderElements }
            </div>
          </div>
        </div>
      );
    }
}

PopoutFollow.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  requestKey: PropTypes.string,
  followCallback: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(PopoutFollow);