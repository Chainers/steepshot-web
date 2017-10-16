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
            tag: "",
            tagInputName: "tag",
            tagList: []
        };

        this.initKeypress();
    }

    _clearAll() {
        this.setState({
            file: '',
            imagePreviewUrl: '',
            title: '',
            tagList: []
        });
    }

    initKeypress() {
        const _this = this;

        document.onkeydown = function(e) {
            switch (e.keyCode) {
                case 13:
                    e.preventDefault();
                    _this.addTag();
                    break;
            }
        };
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ 
            [name] : value.replace(/[^^a-zA-ZА-Яа-яЁё0-9\s]/g, "") 
        }, () => {
            if (name == this.state.tagInputName) {
                this.setState({
                    tagList : this.getTagsArray(this.state.tag),
                    tagError : false
                });   
            }
        });
    }

    getTagsArray(stringWithTags) {
        return stringWithTags.replace(/^\s+|\s+$/gm, '').split(/\s+/);
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (this.state.tagList.length > 4) {
            this.setState({
                tagError: true
            })
            return false;
        } 
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
        let tags = this.state.tagList;

        //tags = this.state.tagList.splice(0 ,4);
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

    addTag() {
        let tagList = this.state.tagList;
        tagList.push(this.state.tag);

        this.setState({
            tag: '',
            tagList: tagList
        });
    }

    removeTag(index) {
        let newTagList = this.state.tagList;
        newTagList.splice(index, 1);
        this.setState({
            tag: newTagList.join(' '),
            tagList: newTagList,
            tagError: false
        });
    }

    _renderTags() {
        let _this = this;
        if (this.state.tagList.length !== 0) {
            let items = this.state.tagList.map((tag, index) => {
                return(
                <div key={index} className="tag">{tag}
                    <button type="button" className="btn-close" onClick={this.removeTag.bind(_this, index)}></button>
                </div>
                )
            });
            return items;
        } else return null;
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        let tagList = null;
        if (imagePreviewUrl) {
            $imagePreview = (<div className="preview-component">
                <div className="post-info">
                    <div className="info-block">
                        <div className="img-preview">
                            <img className="col-xs-12" src={imagePreviewUrl} />
                        </div>
                    </div>
                </div>
                <input id="upload-file" className="file-input" onChange={(e)=>this._handleImageChange(e)} type="file" />
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
                            <input id="formDESCRIPTION" 
                                type="text"
                                name="title"
                                id="title"
                                value={this.state.title}
                                onChange={this.handleChange.bind(this)}
                                required=""
                                autoComplete="off"
                                className="form-control"
                            />
                            <label htmlFor="title" className="name">Description</label>
                        </div>
                    </div>
                    <div className={this.state.tagError ? 'has-error' : ''} >
                        <div className="form-group">
                            <div className="input-container col-xs-12">
                                <input type="text" 
                                    name={this.state.tagInputName}
                                    id="tag"
                                    value={this.state.tag}
                                    onChange={this.handleChange.bind(this)}
                                    required=""
                                    autoComplete="off"
                                    className="form-control"
                                />
                                <label htmlFor="tag" className="name">Hashtag</label>
                                <div className="tags-list clearfix">
                                    {this._renderTags()}
                                </div>
                                <div className="help-block">Enter a hashtag(s). But not more than 4 words</div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="buttons-container col-xs-12">
                            <button onClick={this._clearAll.bind(this)} type="reset" className="btn btn-index">Cancel</button>
                            <button onClick={this._handleSubmit.bind(this)} type="submit" className="btn btn-default">Create new post</button>
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
