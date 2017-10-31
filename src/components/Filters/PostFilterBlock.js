import React from 'react';
import constants from '../../common/constants';
import PropTypes from 'prop-types';

class PostFilterBlock extends React.Component {
    constructor(props) { 
        super(props);

        this.state = {
            filterContainer: [
                {
                    label: constants.POST_FILTERS.TRENDING,
                    isActive: true
                },
                {
                    label: constants.POST_FILTERS.HOT,
                    isActive: false
                },
                {
                    label: constants.POST_FILTERS.NEW,
                    isActive: false
                }
            ],
            isActiveItemIndex: 0
        }

        this.resetActiveFilter(0);
    }

    resetActiveFilter(index) {
        if (index != this.state.isActiveItemIndex) {
            let filterContainer = this.state.filterContainer;

            filterContainer[index].isActive = true;

            if (this.state.isActiveItemIndex >= 0) {
                filterContainer[this.state.isActiveItemIndex].isActive = false;
            }

            this.setState({ 
                filterContainer: filterContainer,
                isActiveItemIndex: index
            });
        }
    }

    switchFilter(index) {
        this.resetActiveFilter(index);
        this.props.updatePostsCallback(this.state.filterContainer[index].label);
    }

    render() {
        return (
            <ul role="tablist" className="nav nav-tabs list-reset">
                {
                    this.state.filterContainer.map((item, index) => {
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

PostFilterBlock.propTypes = {
  updatePostsCallback: PropTypes.func.isRequired
};

export default PostFilterBlock;