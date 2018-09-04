import Anchor from '../../../common/components/anchor'

export default class FocusableChunk extends React.Component {
	static get defaultProps() {
		return {
			indent: 0,
			spellcheck: true
		}
	}

	// getAnchorNode() {
	// 	if (
	// 		__guard__(
	// 			__guard__(this.refs != null ? this.refs.anchor : undefined, x1 => x1.refs),
	// 			x => x.anchorElement
	// 		) == null
	// 	) {
	// 		return null
	// 	}
	// 	return this.refs.anchor.refs.anchorElement
	// }

	render() {
		let { className } = this.props

		return (
			<div
				className={`focusable-chunk anchor-container${className ? ` ${className}` : ''}`}
				contentEditable={false}
			>
				<Anchor {...this.props} name="main" ref="anchor" />
				{this.props.children}
			</div>
		)
	}
}

// function __guard__(value, transform) {
// 	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
// }
