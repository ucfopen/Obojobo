import React from 'react'
import { Editor } from 'slate'
import ColorPicker from './color-picker'
import Dispatcher from '../../common/flux/dispatcher'
import { freezeEditor, unfreezeEditor } from '../../oboeditor/util/freeze-unfreeze-editor'

class TextColorPickerIcon extends React.Component {
	constructor(props) {
		super(props)
		this.domRef = React.createRef()

		this.state = {
			isOpen: false
		}

		this.onWindowMouseDown = this.onWindowMouseDown.bind(this)
		this.open = this.open.bind(this)
		this.close = this.close.bind(this)
	}

	onWindowMouseDown(event) {
		if (!this.domRef.current) return
		if (this.domRef.current.contains(event.target)) return // clicked inside this element

		this.setState({ isOpen: false })
		this.props.editor.toggleEditable(true)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.onWindowMouseDown)
		Dispatcher.off('color-picker:open')
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.onWindowMouseDown, false)
		Dispatcher.on('color-picker:open', this.open)
	}

	open() {
		this.setState({ isOpen: true })
		freezeEditor(this.props.editor)
	}

	close() {
		this.setState({ isOpen: false })
		unfreezeEditor(this.props.editor)
	}

	render() {
		const marks = Editor.marks(this.props.editor)
		const color = marks && marks.color ? marks.color : '#000000'
		return (
			<div ref={this.domRef}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-512 -700 3072 3072">
					<path fill={color} d="M2048,1721.67V2048H0V1721.67Z" />
					<path d="M1459,1434l-147-410H741L598,1434H461L968,102h124l504,1332M1027,265h-4L783,923h487Z" />
				</svg>

				{this.state.isOpen ? <ColorPicker editor={this.props.editor} close={this.close} /> : null}
			</div>
		)
	}
}

export default TextColorPickerIcon
