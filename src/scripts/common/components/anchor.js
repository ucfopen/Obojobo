import { EMPTY_CHAR } from '../../common/text/text-constants'

export default props => (
	<span
		{...props}
		className="anchor"
		contentEditable={true}
		tabIndex={props.shouldPreventTab ? '-1' : ''}
		suppressContentEditableWarning={true}
		data-group-index={`anchor:${props.name}`}
	>
		{EMPTY_CHAR}
	</span>
)
