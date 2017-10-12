import React from 'react';
import PropTypes from 'prop-types';
import {
    connect
} from 'react-redux';
import ItemModal from './ItemModal';

class ItemsSliderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderSlider() {
        if (this.props.items != undefined) {
            let itemsForRender = [];
            this.props.items.map((item, index) => {
                itemsForRender.push(
                    <div key={index + "_slide"} className="bs-slide">
                        <ItemModal 
                            item={item} 
                            index={index} 
                            key={index}
                            updateVoteInComponent={this.props.updateVoteInComponent}/>
                    </div>)
            });
            return itemsForRender;
        } else return null;
     }

    render() {
        return (
            <div className="big-slider">
                <div className="bs-wrap not-init">
                    <div className="bs-slider">
                        {this._renderSlider()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        localization: state.localization
    };
};

export default connect(mapStateToProps)(ItemsSliderComponent);
