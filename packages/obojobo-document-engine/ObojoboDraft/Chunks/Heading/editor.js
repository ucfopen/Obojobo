import React from 'react'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'
import isOrNot from '../../../src/scripts/common/isornot'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

class Node extends React.Component {
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
				className={'component'}
				ref={node => {
					this.node = node
				}}
			>
				<div className={'text-chunk obojobo-draft--chunks--heading pad'}>
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
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: HEADING_NODE,
			data: { content: { level: 2 } }
		})
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	json.content.headingLevel = node.data.get('content').level
	json.content.textGroup = []

	const line = {
		text: { value: node.text, styleList: [] },
		data: { align: node.data.get('content').align }
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, line)
	})

	json.content.textGroup.push(line)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }
	json.data.content.level = node.content.headingLevel

	json.nodes = []
	node.content.textGroup.forEach(line => {
		json.data.content.align = line.data ? line.data.align : 'left'
		const headingline = {
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(headingline)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case HEADING_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== HEADING_NODE) return
		if (node.text !== '') return

		return (
			<span
				className={'placeholder align-' + node.data.get('content').align}
				contentEditable={false}
			>
				{'Type Your Heading Here'}
			</span>
		)
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Heading': {
				nodes: [
					{
						match: [{ object: 'text' }],
						min: 1
					}
				]
			}
		}
	}
}

const Heading = {
	components: {
		Node
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Heading
