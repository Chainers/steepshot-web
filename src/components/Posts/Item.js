import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router';
import { getPostComments } from '../../actions/posts';
import ReactResizeDetector from 'react-resize-detector';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          item: this.props.item,
          modalIsOpen: false,
          currentIndex: this.props.index,
          comments: []
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
      let propsItem = this.state.item;

      propsItem.total_payout_reward = '$' + parseFloat(propsItem.total_payout_reward).toFixed(2);

      for (let i = 0; i < propsItem.tags.length; i++) {
        propsItem.tags[i] = '#' + propsItem.tags[i];
      }

      this.setState({ item: propsItem });
    }

    openModal() {
      this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
      let _this = this;

      getPostComments(this.props.item.author, this.props.item.url).then((response) => {
        _this.setState({ comments: response});
        console.log(response);
  		});

      this._onResize();
    }

    closeModal() {
      this.setState({modalIsOpen: false});
    }

    next() {
      this.setState({ item: this.props.items[this.state.currentIndex + 1], currentIndex: this.state.currentIndex + 1 });
    }

    previous() {
      this.setState({ item: this.props.items[this.state.currentIndex - 1], currentIndex: this.state.currentIndex - 1 });
    }

    _onResize() {
      const popupHeight = window.innerHeight - 200;

      $('#popup-image').height(popupHeight);
      $('#popup-info').height(popupHeight);
    }

    render() {
      let _this = this;
      let comments= <div>No comments</div>;
      if (this.state.comments.length != 0) {
        comments = this.state.comments.map((item) => {
          return <p>{item}</p>
        });
      }
      let itemImage = this.state.item.body;

      var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

      const authorLink = `/userProfile/${this.state.item.author}`;

      return (
        <div>
          <div className="post-container col-lg-3 col-md-6 col-sm-8 col-xs-9" onClick={this.openModal}>
            <div className="row body-row">
              <img className="post-img col-md-12 col-sm-12 col-xs-1" src={this.state.item.body}/>
            </div>
            <div className="row post-footer">
              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                <img className="user-avatar" src={this.state.item.avatar} alt="Image"/>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <Link to={authorLink}><strong>{this.state.item.author}</strong></Link>
              </div>
              <div className="pull-right col-lg-3 col-md-3 col-sm-3 col-xs-3 span-with-no-border">
                <span className="star rating-text">&#9825; {this.state.item.net_votes}</span>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                <em>
                  {
                    this.state.item.tags.map((tag) => {
                      return <a href="#" className="tags-urls">{tag}</a>
                    })
                  }
                </em>
              </div>
              <div className="payout-reward col-lg-4 col-md-4 col-sm-4 col-xs-4">
                {this.state.item.total_payout_reward}
              </div>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal.bind(_this)}
            onRequestClose={this.closeModal}
            className='popout-container'
            contentLabel="Example Modal"
          >
          <div id="popup" className="custom-popup">
            <div className="my-modal">
              <div className="">
                <div className="popup-header">
                  <div className="popup-title">
                    {this.state.item.title}
                  </div>
                  <button type="button" className="close col-lg-1 col-md-1 col-sm-1 col-xs-1" onClick={this.closeModal}>&times;</button>
                </div>
                <div className="popup-body">
                  <div className="popup-image-block" id="popup-image">
                    <img className="popup-image" src={this.state.item.body} alt="Image" />
                  </div>
                  <div className="post-popup-info" id="popup-info">
                    <div className="author-info">
                      <div className="">
                        <img className="user-avatar" src={this.state.item.avatar} alt="Image" />
                      </div>
                      <div className="author-name">
                        <a href={this.state.item.author}><strong>{this.state.item.author}</strong></a>
                        <span>{this.state.item.about}</span>
                      </div>
                    </div>
                    <br/>
                    <div className="post-info">
                      <div className="rating-block">
                        <span className="star rating-text">&#9825; {this.state.item.net_votes}</span>
                      </div>
                      <div className="">
                        <span className="payout-reward">{this.state.item.total_payout_reward} </span>
                      </div>
                    </div>
                    <div className="hash-tags">
                      {
                        this.state.item.tags.map((tag) => {
                          return <a href="#" className="tags-urls">{tag}</a>
                        })
                      }
                    </div>
                    <hr/>
                    <div className="popup-comments">
                      {comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='slick-buttons'>
              <button className='left-button' onClick={this.previous.bind(_this)}>Previous</button>
              <button className='right-button' onClick={this.next.bind(_this)}>Next</button>
            </div>
            </div>
            <ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
          </Modal>
        </div>
      );
    }
}
