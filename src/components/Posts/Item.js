import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          item: this.props.item
        };
    }

    componentDidMount() {
      let propsItem = this.state.item;

      propsItem.total_payout_reward = '$' + parseFloat(propsItem.total_payout_reward).toFixed(2);

      this.setState({ item: propsItem});
    }

    render() {
        return (
            <div className="post-container col-lg-3 col-md-6 col-sm-8 col-xs-9">
              <div className="row">
                <img className="post-img col-md-12 col-sm-12 col-xs-1" src={this.state.item.body} />
              </div>
              <div className="row post-footer">
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                  <img width="40px" height="40px" className="user-avatar" src={this.state.item.avatar} alt="Image" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <a href={this.state.item.author}><strong>{this.state.item.author}</strong></a>
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
        );
    }
}
