import React from 'react';
import constants from '../../common/constants';
import PropTypes from 'prop-types';
import TabsWrapper from '../Wrappers/TabsWrapper';

class TabsFilterComponent extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            ...this.props
        }
        this.state.keys[this.state.activeItemIndex].isActive = true;
    }

    componentWillReceiveProps(nextProps) {
        let newProps = nextProps;
        newProps.keys[newProps.activeItemIndex].isActive = true;
        this.setState(
            { ...newProps } 
        );
    }

    resetActiveFilter(index) {

        let keys = this.state.keys;
        keys[index].isActive = true;

        if (this.state.activeItemIndex) {
            keys[this.state.activeItemIndex].isActive = false;
        }

        this.setState({ 
            keys : keys,
            activeItemIndex: index
        });
    }

    switchFilter(index) {
        if (index == this.state.activeItemIndex) return false;
        this.resetActiveFilter(index);
    }

    renderNavigation() {
        let navItems = [];
        this.state.keys.map((item, index) => {
            let styles = '';

            if (item.isActive) {
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
                        className="tab-head"
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
                <TabsWrapper 
                    activeTab={this.state.activeItemIndex}
                >
                    {this.state.children}
                </TabsWrapper>
            </div>
        );
    }
}

TabsFilterComponent.propTypes = {
  activeItemIndex : PropTypes.number.isRequired,
  keys : PropTypes.array.isRequired
};

export default TabsFilterComponent;