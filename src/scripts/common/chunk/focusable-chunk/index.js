import Anchor from '../../../common/components/anchor'

const FocusableChunk = props => (
	<div
		className={`focusable-chunk anchor-container${props.className ? ` ${props.className}` : ''}`}
		contentEditable={false}
	>
		<Anchor {...props} name="main" />
		{props.children}
	</div>
)

FocusableChunk.defaultProps = {
	indent: 0,
	spellcheck: true
}

export default FocusableChunk
