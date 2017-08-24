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
        if (this.state.saveSettings.nsfw != this.state.settings.nsfw ||
            this.state.saveSettings.lowRated != this.state.settings.lowRated) {
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
                        checked={this.state.settings.lowRated}
                        onChange={this.handleInputChange.bind(this, "lowRated")} />
                    <label onClick={this.handleInputChange.bind(this, "lowRated")}>Show low rate posts</label>
                </div>
                <div className='checkbox-block'>
                    <input
                        type="checkbox"
                        checked={this.state.settings.nsfw}
                        onChange={this.handleInputChange.bind(this, "nsfw")} />
                    <label onClick={this.handleInputChange.bind(this, "nsfw")}>Use NSFW setting</label>
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