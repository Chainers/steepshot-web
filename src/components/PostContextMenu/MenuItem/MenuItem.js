import * as React from 'react';
import Delimiter from '../DelimitersWrapper/DelimitersWrapper';
import './menuItem.css';

class MenuItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mouseEnter: false
		}
	}

	onMouseEnter() {
		this.setState({
			mouseEnter: true,
		})
	}

	onMouseLeave() {
		this.setState({
			mouseEnter: false,
		})
	}

	render() {
		const boxStyle = {
			flexDirection: this.props.fullScreen ? 'row' : 'column',
			alignItems: this.props.fullScreen ? 'center' : 'stretch',
			justifyContent: this.props.fullScreen ? 'flex-start' : 'stretch',
			marginLeft: this.props.fullScreen ? '45px' : 'auto',
		};
		const contentStyle = {
			margin: this.props.fullScreen ? 'auto 5px' : 'auto',
			color: this.state.mouseEnter ? '#eb443d' : '#000',
		};
		return (
			<div className="wrapper_men-ite"
					 onClick={this.props.callback}
					 onMouseEnter={this.onMouseEnter.bind(this)}
					 onMouseLeave={this.onMouseLeave.bind(this)}>
				<Delimiter hasDelimiter={this.props.hasDelimiter}
									 fullScreen={this.props.fullScreen}>
					<div className="box_men-ite" style={boxStyle}>
						<img src={this.state.mouseEnter ? this.props.revertImg : this.props.img}
								 className="img_men_ite" style={contentStyle} alt={this.props.alt}/>
						<span className="text-menu_men-ite"
									style={contentStyle}>{this.props.alt}</span>
					</div>
				</Delimiter>
			</div>
		);
	}
}

export default MenuItem;
