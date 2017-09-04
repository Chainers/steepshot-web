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
            <div className="filter-container">
                <div className="filter-block">
                    {
                        this.state.filterContainer.map((item, index) => {
                            let styles = 'filter-item';

                            if (item.isActive) {
                                styles = 'filter-item active';
                            }

                            return <div className={styles} 
                                onClick={this.switchFilter.bind(this, index)}>
                                {item.label}
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

PostFilterBlock.propTypes = {
  updatePostsCallback: PropTypes.func.isRequired
};

export default PostFilterBlock;