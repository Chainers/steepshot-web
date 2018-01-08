import React from 'react';
import constants from '../../common/constants';
import PropTypes from 'prop-types';

class TabsFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          ...this.props,
          whereIs : false
        }
    }
    componentDidMount() {
      let location = document.location.pathname.match(/\/@\w+/);
      if (location != null) {
        this.setState({whereIs : true});
      }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            keys : nextProps.keys
        });

        this.switchFilter(nextProps.activeItemIndex);
    }

    switchFilter(index) {
        if (this.state.activeItemIndex == index) return false;
        this.props.updateCallback(index);
        this.setState({
            activeItemIndex : index,
        })
    }

    renderNavigation() {
        let navItems = [];
        this.state.keys.map((item, index) => {
            let styles = '';
            if (this.state.activeItemIndex == index) {
                styles = 'active';
            }

            navItems.push(
                <li role="presentation" key={index} className={styles}>
                    <a
                        onClick={this.switchFilter.bind(this, index)}
                        aria-controls={"tab-" + index}
                        href={"#tab-" + index}
                        role="tab"
                        data-toggle="tab"
                        className={
                          this.state.param
                          ?
                            "tab-head tabs-width"
                          :
                            "tab-head"
                        }
                    >
                        {item.label}
                    </a>
                </li>
            );
        });
        return navItems;
    }

    render() {
        return (
            <div>
                <ul role="tablist" className="nav nav-tabs list-reset">
                    {this.renderNavigation()}
                </ul>
            </div>
        );
    }
}

TabsFilterComponent.propTypes = {
  activeItemIndex : PropTypes.number.isRequired,
  keys : PropTypes.array.isRequired,
  updateCallback : PropTypes.func.isRequired
};

export default TabsFilterComponent;
