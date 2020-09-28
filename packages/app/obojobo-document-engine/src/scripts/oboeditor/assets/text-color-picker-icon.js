import React from 'react'
import { Editor } from 'slate'
import ColorPicker from './color-picker'

class TextColorPickerIcon extends React.Component {
	constructor(props) {
		super(props)
		this.domRef = React.createRef()

		this.state = {
			isSelected: false
		}

		this.onWindowMouseDown = this.onWindowMouseDown.bind(this)
	}

	onWindowMouseDown(event) {
		if (!this.domRef.current) return
		if (this.domRef.current.contains(event.target)) return // clicked inside this element

		this.setState({ isSelected: false })
		this.props.editor.toggleEditable(true)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.onWindowMouseDown)
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.onWindowMouseDown, false)
	}

	render() {
		const marks = Editor.marks(this.props.editor)
		const color = marks && marks.color ? marks.color : '#000000'
		return (
			<div
				className="text-color-icon"
				ref={this.domRef}
				onClick={() => {
					this.props.editor.toggleEditable(false)
					this.setState({ isSelected: true })
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-512 -700 3072 3072">
					<path fill={color} d="M2048,1721.67V2048H0V1721.67Z" />
					<path
						height="2px"
						width="2px"
						d="M1459,1434l-147-410H741L598,1434H461L968,102h124l504,1332M1027,265h-4L783,923h487Z"
					/>
				</svg>

				{this.state.isSelected ? (
					<ColorPicker
						editor={this.props.editor}
						onClose={() => this.setState({ isSelected: false })}
					/>
				) : null}
			</div>
		)
	}
}

export default TextColorPickerIcon
