import React from 'react';
import constants from '../../common/constants';
import PropTypes from 'prop-types';

class TabsFilterComponent extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            ...this.props
        }
        this.state.keys[this.state.activeItemIndex].isActive = true;
    }

    // insertUsername(point, userName) {
    //     if (category == undefined) return point;
    //     let path = point.split('/');
    //     return `${path[0]}/${category}/${path[1]}`;
    // }

    makeFilterParams(key) {
        return {
            key : key.label,
            point : key.point
        }
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
        this.state.updateCallback(this.makeFilterParams(this.state.keys[index]));
    }

    render() {
        return (
            <ul role="tablist" className="nav nav-tabs list-reset">
                {
                    this.state.keys.map((item, index) => {
                        let styles = '';

                        if (item.isActive) {
                            styles = 'active';
                        }

                        return (
                            <li role="presentation" key={index} className={styles}>
                                <a 
                                    onClick={this.switchFilter.bind(this, index)} 
                                    aria-controls="tab-1" 
                                    role="tab" 
                                    data-toggle="tab" 
                                    className="tab-head"
                                >
                                    {item.label}
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
}

TabsFilterComponent.propTypes = {
  updateCallback : PropTypes.func.isRequired,
  activeItemIndex : PropTypes.number.isRequired,
  keys : PropTypes.array.isRequired
};

export default TabsFilterComponent;