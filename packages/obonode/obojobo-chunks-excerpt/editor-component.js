import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

class Excerpt extends React.Component {
	constructor(props) {
		super(props)

		this.onChangeBodyStyle = this.onChangeContentValue.bind(this, 'bodyStyle')
		this.onChangeTopEdge = this.onChangeContentValue.bind(this, 'topEdge')
		this.onChangeBottomEdge = this.onChangeContentValue.bind(this, 'bottomEdge')
		this.onChangeWidth = this.onChangeContentValue.bind(this, 'width')
		this.onChangeFont = this.onChangeContentValue.bind(this, 'font')
	}

	onChangeContentValue(contentValueName, event) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, [contentValueName]: event.target.value } },
			{ at: path }
		)
	}

	render() {
		const content = this.props.element.content
		return (
			<Node {...this.props}>
				<div
					className={`text-chunk obojobo-draft--chunks--excerpt pad is-body-style-type-${content.bodyStyle} is-top-edge-type-${content.topEdge} is-bottom-edge-type-${content.bottomEdge} is-width-${content.width} is-font-${content.font}`}
				>
					<div>
						<div>
							<label>
								<span>Style:</span>
							</label>
							<select value={content.bodyStyle} onChange={this.onChangeBodyStyle}>
								<option value="filled-box">Filled Box</option>
								<option value="bordered-box">Bordered Box</option>
								<option value="white-paper">White Paper</option>
								<option value="modern-paper">Modern Paper</option>
								<option value="yellow-paper">Yellow Paper</option>
								<option value="aged-paper">Aged Paper</option>
								{/* <option value="modern-book-page">Modern Book Page</option>
								<option value="old-book-page">Older Book Page</option> */}
								<option value="none">None</option>
							</select>
						</div>
						<div>
							<label>
								<span>Font:</span>
							</label>
							<select value={content.font} onChange={this.onChangeFont}>
								<option value="serif">Obojobo Serif</option>
								<option value="sans">Obojobo Sans-Serif</option>
								<option value="monospace">Monospace</option>
								<option value="times-new-roman">Times New Roman</option>
								<option value="georgia">Georgia</option>
								<option value="helvetica">Helvetica</option>
								<option value="courier">Courier</option>
								<option value="palatino">Palatino</option>
							</select>
						</div>
						<div>
							<label>
								<span>Top Edge</span>
							</label>
							<select value={content.topEdge} onChange={this.onChangeTopEdge}>
								<option value="normal">Normal</option>
								<option value="fade">Fade</option>
								<option value="jagged">Jagged</option>
							</select>
						</div>
						<div>
							<label>
								<span>Bottom Edge</span>
							</label>
							<select value={content.bottomEdge} onChange={this.onChangeBottomEdge}>
								<option value="normal">Normal</option>
								<option value="fade">Fade</option>
								<option value="jagged">Jagged</option>
							</select>
						</div>
						<div>
							<label>
								<span>Width</span>
							</label>
							<select value={content.width} onChange={this.onChangeWidth}>
								<option value="large">Large</option>
								<option value="medium">Medium</option>
								<option value="small">Small</option>
								<option value="extra-small">Extra Small</option>
							</select>
						</div>
					</div>
					<blockquote>{this.props.children}</blockquote>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Excerpt)
