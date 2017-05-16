import './logo.scss';

import NavUtil from 'Viewer/util/nav-util';
import logo from 'svg-url-loader?noquotes!./obojobo-logo.svg';

const { OBO } = window;
import ObojoboDraft from 'ObojoboDraft'
let { getBackgroundImage } = ObojoboDraft.util;

let Logo = React.createClass({

	render() {
		let bg = getBackgroundImage(logo);

		return <div className={`viewer--components--logo${this.props.inverted ? ' is-inverted' : ' is-not-inverted'}`} style={
			{
				backgroundImage: bg
			}
		}>
			Obojobo
		</div>;
	}
});

export default Logo;
