import React from 'react';
import { 
    getNSFW, 
    getLowRated, 
    updateLowRated,
    updateNSFW,
    getSettings,
    updateSettings
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
            },
            saveSettings: {}
        };
    }

    componentDidMount() {
        const settings = getSettings();

        this.setState({ settings: settings });
    }

    handleInputChange(event) {
        let settings = this.state.settings;

        settings[event.target.name] = !this.state.settings[event.target.name];
        this.setState({ settings: settings });
    }

    upateSettings() {
        updateSettings(this.state.settings);
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