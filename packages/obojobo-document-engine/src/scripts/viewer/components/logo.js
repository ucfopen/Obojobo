import './logo.scss'
import isOrNot from '../../common/isornot'

const Logo = props => (
	<div className={`viewer--components--logo${isOrNot(props.inverted, 'inverted')}`}>Obojobo</div>
)

export default Logo
