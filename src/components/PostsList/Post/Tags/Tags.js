import React from 'react';
import {Link} from 'react-router-dom';
import {utils} from "../../../../utils/utils";

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
			return <Link key={index} to={`/search/${this.checkFirst(tag)}`}>
				{utils.tagPrettify(tag) + ' '}
			</Link>
		})
	}

	render() {
		return (
			<div className="container_tags">
				{this.getTags()}
			</div>
		);
	}
}

export default Tags;
