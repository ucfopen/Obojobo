import './viewer-component.scss'

import React from 'react'
import isOrNot from '../../../src/scripts/common/isornot'

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
		if (!this.node) return
		if (this.node.contains(event.target)) return

		this.handleOutsideClick()
	}

	handleLevelChange(num) {
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState(state => {
			return { isOpen: !state.isOpen }
		})

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					level: num,
					align: this.props.node.data.get('content').align
				}
			}
		})
		editor.onChange(change)
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
		let dropText = text.length > 15 ? text.slice(0, 15) : text
		dropText = dropText.length === 0 ? 'Your Heading' : dropText
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

				<div className={'dropdown-heading'}>
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
			</div>
		)
	}
}

export default Heading
