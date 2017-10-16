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
import Constants from '../../common/constants';
import PropTypes from 'prop-types';

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: {
                [Constants.SETTINGS.show_low_rated]: false,
                [Constants.SETTINGS.show_nsfw]: false
            },
            saveSettings: getSettings(),
            showMessage: false,
            message: ''
        };
    }

    componentDidMount() {
        const userSettings = getSettings();

        this.setState({ 
            settings: userSettings
        });
    }

    _setDefaultMessageOptions() {
        this.setState({ 
            showMessage: false, 
            message: ''
        });
    }

    handleInputChange(name) {
        let settings = this.state.settings;

        this._setDefaultMessageOptions();

        settings[name] = !this.state.settings[name];
        this.setState({ settings: settings });
    }

    upateSettings() {
        if (this.state.saveSettings != this.state.settings) {
                updateSettings(this.state.settings);
                this.setState({ 
                    showMessage: true, 
                    message: 'Successfuly updated',
                    saveSettings: getSettings()
                });
        } else {
            this.setState({ showMessage: true, message: 'Nothing to update' });
        }
    }

    render() {
        const message = <div className='message'>{this.state.message}</div>;
        return(
            <div className="container-block">
                <div className='checkbox-block'>
                    <input
                        type="checkbox"
                        checked={this.state.settings[Constants.SETTINGS.show_low_rated]}
                        onChange={this.handleInputChange.bind(this, Constants.SETTINGS.show_low_rated)} />
                    <label onClick={this.handleInputChange.bind(this, Constants.SETTINGS.show_low_rated)}>Show low rate posts</label>
                </div>
                <div className='checkbox-block'>
                    <input
                        type="checkbox"
                        checked={this.state.settings[Constants.SETTINGS.show_nsfw]}
                        onChange={this.handleInputChange.bind(this, Constants.SETTINGS.show_nsfw)} />
                    <label onClick={this.handleInputChange.bind(this, Constants.SETTINGS.show_nsfw)}>Use NSFW setting</label>
                </div>
                <div className='checkbox-block' onClick={this.upateSettings.bind(this)}>
                    <div className="upload-button">
                        Save
                    </div>
                    {this.state.showMessage ? message : null}
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