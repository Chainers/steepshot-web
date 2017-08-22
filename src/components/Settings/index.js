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

    handleInputChange(event) {
        let settings = this.state.settings;

        this._setDefaultMessageOptions();

        settings[event.target.name] = !this.state.settings[event.target.name];
        this.setState({ settings: settings });
    }

    upateSettings() {
        if (this.state.saveSettings.nsfw != this.state.settings.nsfw ||
            this.state.saveSettings.lowRated != this.state.settings.lowRated) {
                this.setState({ 
                    showMessage: true, 
                    message: 'Successfuly updated',
                    saveSettings: this.state.settings
                });
                updateSettings(this.state.settings);
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