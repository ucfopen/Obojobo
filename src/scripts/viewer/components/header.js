import './header.scss'
import Logo from './logo'

export default class Header extends React.Component {
	render() {
		let logoPosition

		switch (this.props.logoPosition) {
			case 'left':
				logoPosition = 'left'
				break

			case 'right':
			default:
				logoPosition = 'right'
				break
		}

		return (
			<header className={'viewer--components--header is-logo-' + logoPosition}>
				<div className="wrapper">
					<span className="module-title">{this.props.moduleTitle}</span>
					<span className="location">{this.props.location}</span>
					<Logo />
				</div>
			</header>
		)
	}
}
