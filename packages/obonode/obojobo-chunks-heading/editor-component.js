import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

class Heading extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isOpen: false
		}

		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick, false)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false)
	}

	handleClick(event) {
		if (!this.node || this.node.contains(event.target)) return

		this.handleOutsideClick()
	}

	handleLevelChange(num) {
		const editor = this.props.editor

		this.setState({ isOpen: false })

		return editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					level: num,
					align: this.props.node.data.get('content').align
				}
			}
		})
	}
	toggleLevelSelect() {
		this.setState(state => {
			return { isOpen: !state.isOpen }
		})
	}
	handleOutsideClick() {
		this.setState({ isOpen: false })
	}

	render() {
		const content = this.props.node.data.get('content')
		const HTag = `h${content.level || 1}`
		const text = this.props.node.text
		const dropText = text.slice(0, 15) || 'Your Heading'

		return (
			<div
				className={'text-chunk obojobo-draft--chunks--heading pad'}
				ref={node => {
					this.node = node
				}}
			>
				<HTag>
					<span className={'text align-' + content.align}>{this.props.children}</span>
				</HTag>

				<div className={'dropdown-heading'} contentEditable={false}>
					<button onClick={() => this.toggleLevelSelect()}>{'▼'}</button>
					<div className={'drop-content-heading ' + isOrNot(this.state.isOpen, 'open')}>
						<button onClick={() => this.handleLevelChange(1)}>
							<h1>{dropText}</h1>
						</button>
						<button onClick={() => this.handleLevelChange(2)}>
							<h2>{dropText}</h2>
						</button>
						<button onClick={() => this.handleLevelChange(3)}>
							<h3>{dropText}</h3>
						</button>
						<button onClick={() => this.handleLevelChange(4)}>
							<h4>{dropText}</h4>
						</button>
						<button onClick={() => this.handleLevelChange(5)}>
							<h5>{dropText}</h5>
						</button>
						<button onClick={() => this.handleLevelChange(6)}>
							<h6>{dropText}</h6>
						</button>
					</div>
				</div>
				<div>
					<select>
						<option value="banana">Banana</option>
						<option value="top">Top</option>
						<option value="grr">Grr</option>
					</select>
				</div>
			</div>
		)
	}
}

export default Heading
