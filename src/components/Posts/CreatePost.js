import React from 'react';
import Steem from '../../libs/steem';
import {
    connect
} from 'react-redux';
import {
    getPostShaddow
} from '../../actions/posts';

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: '',
            title: '',
            tagFirst: '',
            tagSecond: '',
            tagThird: '',
            tagFouth: '',
            message: ''
        };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    _handleSubmit(e) {
        e.preventDefault();
        const callback = (result, message) => { 
            if (result) {
                this._getPostShaddow(message);
                this.props.history.push('/profile'); 
            } else {
                this.setState({ 
                    message: 'You can only create posts after 5 minutes after previous.' 
                });
            }
            
        };
        Steem.createPost(this.props.postingKey, this._getTags(), this.props.username, this.state.title, this.state.file, callback);
    }

    _getPostShaddow(message) {
        const _this = this;
        const url = '@' + message[1].author + '/' + message[1].permlink;

        getPostShaddow(url).then((result) => {
            if (result && result.length === 0) {
                return _this._getPostShaddow(message);
            }
            _this.props.history.push('/profile'); 
        });
    }

    _getTags() {
        let tags = [];
        const tagsNames = ['tagFirst', 'tagSecond', 'tagThird', 'tagFouth'];

        tagsNames.forEach((tagName) => {
            if (this.state[tagName]) {
                tags.push(this.state[tagName]);
            }
        });

        tags.push('steepshot');

        return tags;
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

    _getPostImageStyles(itemImage) {
        return {
            backgroundImage: `url(${itemImage})`, 
            backgroundPosition: 'fixed', 
            backgroundRepeat: 'no-repeat', 
            backgroundOrigin: 'center', 
            backgroundClip: 'content-box', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
        };
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<div className="preview-component">
                <div className="post-info">
                    <div className="info-block">
                        <div className="img-preview">
                            <img src={imagePreviewUrl} />
                        </div>
                    </div>
                </div>
            </div>);
        } else {
            $imagePreview = (<div className="upload-field empty">
                <div className="uf-preview">
                    <div className="uf-icon"></div>
                    <div className="uf-text">Click to download a picture</div>
                </div>
                <input id="upload-file" className="file-input" onChange={(e)=>this._handleImageChange(e)} type="file" />
            </div>);
        }

        return (
            <div className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                <form className="form-create form-horizontal">
                    <div className="form-group">
                        <div className="input-container col-xs-12">
                            <div className="upload">
                                {$imagePreview}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-container col-xs-12">
                            <input id="formPOINTERS" type="text" name="formPOINTERS" value="" required="" autocomplete="off" className="form-control" />
                            <label for="formPOINTERS" className="name">Pointers</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-container col-xs-12">
                            <input id="formDESCRIPTION" type="text" name="formDESCRIPTION" value="" required="" autocomplete="off" className="form-control" />
                            <label for="formDESCRIPTION" className="name">Description</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-container col-xs-12">
                            <input id="formHASHTAG" type="text" name="formHASHTAG" value="" required="" autocomplete="off" className="form-control" />
                            <label for="formHASHTAG" className="name">Hashtag</label>
                            <div className="tags-list clearfix">
                                <div className="tag">Photo
                                    <button type="button" className="btn-close"></button>
                                </div>
                                <div className="tag">Photoshop
                                    <button type="button" className="btn-close"></button>
                                </div>
                            </div>
                            <div className="help-block">Enter a hashtag through a comma in order for each word to be a separate tag. But not more than 10 words</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="buttons-container col-xs-12">
                            <button type="reset" className="btn btn-index">Cancel</button>
                            <button onClick={(e)=>this._handleSubmit(e)} type="submit" className="btn btn-default">Create new post</button>
                        </div>
                    </div>
                </form>
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

{/* <div className="preview-component">
            <div className="image-block">
                <label>Image preview</label>
                <div className="img-preview">
                    {$imagePreview}
                </div>
            </div>
            <div className="post-info">
                <div className="info-block">
                    <label>Title</label>
                    <input placeholder="Input titile" type="text" name="title" id="title" value={this.state.title} onChange={this.handleChange.bind(this)}/>

                    <label>Input tags</label>
                    <input placeholder="Input first tag and main tag"
                        type="text"
                        name="tagFirst"
                        id="tagFirst"
                        value={this.state.tagFirst}
                        onChange={this.handleChange.bind(this)}/>
                    <input placeholder="Input second tag"
                        type="text"
                        name="tagSecond"
                        id="tagSecond"
                        value={this.state.tagSecond}
                        onChange={this.handleChange.bind(this)}/>
                    <input placeholder="Input third tag"
                        type="text"
                        name="tagThird"
                        id="tagThird"
                        value={this.state.tagThird}
                        onChange={this.handleChange.bind(this)}/>
                    <input placeholder="Input fouth tag"
                        type="text"
                        name="tagFouth"
                        id="tagFouth"
                        value={this.state.tagFouth}
                        onChange={this.handleChange.bind(this)}/>

                    <label>Choose you photo</label>
                    <input className="file-input" 
                        type="file"
                        onChange={(e)=>this._handleImageChange(e)} />
                </div>
                <div className='error'>
                    { this.state.message }
                </div>
                <button className="submit-button" 
                        type="submit" 
                        onClick={(e)=>this._handleSubmit(e)}>Create post</button>
            </div>
        </div> */}