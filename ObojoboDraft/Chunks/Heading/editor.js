import React from 'react'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'
import isOrNot from '../../../src/scripts/common/isornot'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
		this.state.isOpen = false

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
			return { isOpen: !state.isOpen, level: num }
		})

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					level: num
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
		const HTag = `h${this.state.level || 1}`
		const text = this.props.node.text
		const dropText = text.length > 15 ? text.slice(0, 15) : text
		return (
			<div
				className={'component'}
				ref={node => {
					this.node = node
				}}
			>
				<div className={'text-chunk obojobo-draft--chunks--heading pad'}>
					<HTag>
						<span className={'text align-' + this.state.align}>{this.props.children}</span>
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
		.collapseToStartOfNextText()
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
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Heading': {
				nodes: [{ objects: ['text'] }]
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
