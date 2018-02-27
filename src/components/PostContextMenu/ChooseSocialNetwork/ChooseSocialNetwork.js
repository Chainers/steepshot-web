import * as React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  VKShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  VKIcon,
  RedditIcon
} from 'react-share';

class ChooseSocialNetwork extends React.Component {
  constructor(props) {
    super(props);

  }

  closeModal(e) {
    e.stopPropagation();
    this.props.closeModal();
    this.props.modalsCallback(false);
  }

  render() {
    let shareAdress = `https://alpha.steepshot.io/post${this.props.url.replace(/\/\w+(\/@[\w-.]+)/, '$1')}`;
    let postTitle = this.props.item.title;
    return (
      <div className="wrapper_csn-mod">
        <div className="body_confirm-del-mod">
          <p className="title_csn-mod">Social networks we cooperate with</p>
          <div className="share-buttons_csn">
            <div className="soc-network-item_csn">
              <FacebookShareButton url={shareAdress}
                                   hashtag="#steepshot"
              >
                <FacebookIcon size={42} round={false}/>
                <p>Facebook</p>
              </FacebookShareButton>
            </div>
            <div className="soc-network-item_csn">
              <VKShareButton url={shareAdress}
                             title={postTitle}
                             image={this.props.item.body}
              >
                <VKIcon size={42} round={false}/>
                <p>VKontakte</p>
              </VKShareButton>
            </div>
            <div className="soc-network-item_csn">
              <TwitterShareButton url={shareAdress}
                                  title={postTitle}
                                  hashtags={this.props.item.tags}
                                  image={this.props.item.body}
              >
                <TwitterIcon size={42} round={false} />
                <p>Twitter</p>
              </TwitterShareButton>
            </div>
            <div className="soc-network-item_csn">
              <LinkedinShareButton url={shareAdress}
                                   title={postTitle}
              >
                <LinkedinIcon size={42} round={false}/>
                <p>Linkedin</p>
              </LinkedinShareButton>
            </div>
            <div className="soc-network-item_csn">
              <RedditShareButton url={shareAdress}
                                 title={postTitle}
              >
                <RedditIcon size={42} round={false}/>
                <p>Reddit</p>
              </RedditShareButton>
            </div>
          </div>
        </div>
        <div className="footer_csn">
          <p className="text--center">Select social network you want share to</p>
        </div>
      </div>
    );
  }
}


export default ChooseSocialNetwork;
