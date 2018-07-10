import React from 'react';
import {Link} from 'react-router-dom';
import Utils from '../../../../utils/Utils';
import './tags.css';

class Tags extends React.Component {

	checkFirst(str) {
		if (str[0] === '#') return str.substring(1);
		return str;
	}

	getTags() {
		if (!this.props.tags) return null;
		return this.props.tags.map((tag, index) => {
			if (tag === 'steepshot' || tag === '#steepshot') {
				return null;
			}
			tag = Utils.detransliterate(tag);
			return <Link key={index} to={`/search/${this.checkFirst(tag)}`}>
				{Utils.tagPrettify(tag) + ' '}
			</Link>
		})
	}

	render() {
		return (
			<div className="container_tags break--word">
				{this.getTags()}
			</div>
		);
	}
}

export default Tags;
