import React from 'react';
import { 
    getNSFW, 
    getLowRated, 
    updateLowRated 
} from '../../actions/settings';
import { 
    connect, 
    store 
} from 'react-redux';
import PropTypes from 'prop-types';

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: {
                nsfw: false,
                lowRated: false
            }
        };
    }

    componentDidMount() {
        getNSFW().then((result) => {
            let settings = this.state.settings;
            settings.nsfw = result.show_nsfw;
            this.setState({ settings: settings});
        });

        getLowRated().then((result) => {
            let settings = this.state.settings;
            settings.lowRated = result.show_low_rated;
            this.setState({ settings: settings});
        });
    }

    handleInputChange(event) {
        let settings = this.state.settings;

        settings[event.target.name] = !this.state.settings[event.target.name];
        this.setState({ settings: settings });
    }

    upateSettings() {
        //@TODO: Update user settings || Not intergated method
        // updateLowRated(this.state.settings.lowRated);
        // updateNSFW(this.state.settings.lowRated);
        
        console.log(this.state.settings);
        console.log('Update settings');
    }

    render() {
        return(
            <div className="container-block">
                <div className='checkbox-block'>
                    <input
                        name="lowRated"
                        type="checkbox"
                        value="lowRated"
                        checked={this.state.settings.lowRated}
                        onChange={this.handleInputChange.bind(this)} />
                    <label>Show low rate posts</label>
                </div>
                <div className='checkbox-block'>
                    <input
                        name="nsfw"
                        type="checkbox"
                        value="nsfw"
                        checked={this.state.settings.nsfw}
                        onChange={this.handleInputChange.bind(this)} />
                    <label>Use NSFW setting</label>
                </div>
                <div className='checkbox-block' onClick={this.upateSettings.bind(this)}>
                    <div className="upload-button">
                        Upload
                    </div>
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
  search: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Settings);