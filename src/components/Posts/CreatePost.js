import React from 'react';
import steem from 'steem';
import { connect } from 'react-redux';

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: '',
            title: '',
            tags: ''
        };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        const _this = this;
        const wif = this.props.postingKey;
        const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        const author = this.props.username;
        const jsonMetadata = {
            tags: [this.state.tags],
            app: 'steepshot/0.0.5' //@TODO get metadata from Backend
        };

        /** Broadcast a post */
        steem.broadcast.comment(
            wif,
            '', // Leave parent author empty
            this.state.tags, // Main tag
            author, // Author
            permlink + '-post', // Permlink
            this.state.title, // Title
            this.state.file, // Body
            jsonMetadata, // Json Metadata
            function(err, result) {
              console.log(err, result);
            }
        );
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
        $imagePreview = (<div className="preview-text">Please select an Image for Preview</div>);
        }

        return (
        <div className="preview-component">
            <div className="img-preview">
            {$imagePreview}
            </div>
            <div className="post-info">
                <div className="info-block">
                    <input placeholder="Input titile" type="text" name="title" id="title" value={this.state.title} onChange={this.handleChange.bind(this)}/>
                    <input placeholder="Input tag" type="text" name="tags" id="tags" value={this.state.tags} onChange={this.handleChange.bind(this)}/>
                    <input className="file-input" 
                        type="file"
                        onChange={(e)=>this._handleImageChange(e)} />
                </div>
                <button className="submit-button" 
                        type="submit" 
                        onClick={(e)=>this._handleSubmit(e)}>Create post</button>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(CreatePost);

/** Broadcast a post */
//   var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
//   steem.broadcast.comment(
//     postingWif,
//     '', // Leave parent author empty
//     'photography', // Main tag
//     username, // Author
//     permlink + '-post', // Permlink
//     'This is just a test!', // Title
//     'Nothing to see here', // Body
//     { tags: ['test'], app: 'steemjs/examples' }, // Json Metadata
//     function(err, result) {
//       console.log(err, result);
//     }
//   );