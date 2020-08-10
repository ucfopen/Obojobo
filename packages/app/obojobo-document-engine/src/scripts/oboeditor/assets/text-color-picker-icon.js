import React from 'react'

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

	componentDidMount() {
		document.addEventListener('mousedown', this.onWindowMouseDown, false)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.onWindowMouseDown, false)
	}

	render() {
		return (
			<div className="text-color-icon" ref={this.domRef}>
				<svg
					className="icon"
					height="20px"
					width="21px"
					style={{ margin: '6.5px 5.5px 5.5px 5.5px' }}
					viewBox="0,0,2048,2048"
					focusable="false"
					onClick={() => {
						this.props.editor.toggleEditable(false)
						this.setState({ isSelected: true })
					}}
				>
					<path
						type="path"
						d="M 2048 2048 h -2048 v -512 h 2048 m -589 -102 l -147 -410 h -571 l -143 410 h -137 l 507 -1332 h 124 l 504 1332 m -569 -1169 h -4 l -240 658 h 487 z"
					></path>
					<path type="path" d="M 51 1997 v -410 h 1946 v 410 z"></path>
					<path
						type="path"
						d="M 2048 1536 v 512 h -2048 v -512 m 1946 102 h -1844 v 308 h 1844 z"
					></path>
					<path type="path" d="M 2048 1536 v 512 h -2048 v -512 z"></path>
					<path
						type="path"
						d="M 1459 1434 l -147 -410 h -571 l -143 410 h -137 l 507 -1332 h 124 l 504 1332 m -569 -1169 h -4 l -240 658 h 487 z"
					></path>
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
