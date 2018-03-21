import './logo.scss'

import NavUtil from '../../viewer/util/nav-util'
import logo from 'svg-url-loader?noquotes!./obojobo-logo.svg'

import Common from 'Common'
let { getBackgroundImage } = Common.util

export default class Logo extends React.Component {
	render() {
		let bg = getBackgroundImage(logo)

		return (
			<div
				className={`viewer--components--logo${
					this.props.inverted ? ' is-inverted' : ' is-not-inverted'
				}`}
				style={{
					backgroundImage: bg
				}}
			>
				Obojobo
			</div>
		)
	}
}
