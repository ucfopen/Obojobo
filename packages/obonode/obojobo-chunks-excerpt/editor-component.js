import './viewer-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

class Excerpt extends React.Component {
	constructor(props) {
		super(props)

		this.onChangePreset = this.onChangePreset.bind(this)
		this.onChangeBodyStyle = this.onChangeContentValue.bind(this, 'bodyStyle')
		this.onChangeTopEdge = this.onChangeContentValue.bind(this, 'topEdge')
		this.onChangeBottomEdge = this.onChangeContentValue.bind(this, 'bottomEdge')
		this.onChangeWidth = this.onChangeContentValue.bind(this, 'width')
		this.onChangeFont = this.onChangeContentValue.bind(this, 'font')
		this.onChangeFontStyle = this.onChangeContentValue.bind(this, 'fontStyle')
		this.onChangeLineHeight = this.onChangeContentValue.bind(this, 'lineHeight')
		this.onChangeFontSize = this.onChangeContentValue.bind(this, 'fontSize')
	}

	getPresetProps(presetName) {
		switch (presetName) {
			case 'simple-filled': {
				return {
					bodyStyle: 'filled-box',
					width: 'medium',
					font: 'sans',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'simple-bordered': {
				return {
					bodyStyle: 'bordered-box',
					width: 'medium',
					font: 'sans',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'card': {
				return {
					bodyStyle: 'card',
					width: 'medium',
					font: 'sans',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'fiction': {
				return {
					bodyStyle: 'yellow-paper',
					width: 'medium',
					font: 'palatino',
					fontStyle: 'regular',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'non-fiction': {
				return {
					bodyStyle: 'modern-paper',
					width: 'medium',
					font: 'georgia',
					fontStyle: 'regular',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'historical': {
				return {
					bodyStyle: 'aged-paper',
					width: 'medium',
					font: 'palatino',
					fontStyle: 'regular',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'poem': {
				return {
					bodyStyle: 'modern-paper',
					width: 'small',
					font: 'palatino',
					fontStyle: 'regular',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'white-paper': {
				return {
					bodyStyle: 'white-paper',
					width: 'large',
					font: 'times-new-roman',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'regular',
					topEdge: 'normal',
					bottomEdge: 'fade'
				}
			}

			case 'instruction-manual': {
				return {
					bodyStyle: 'modern-paper',
					width: 'large',
					font: 'helvetica',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'fade'
				}
			}

			case 'typewritten': {
				return {
					bodyStyle: 'white-paper',
					width: 'large',
					font: 'courier',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'jagged'
				}
			}

			case 'receipt': {
				return {
					bodyStyle: 'white-paper',
					width: 'extra-small',
					font: 'monospace',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'jagged'
				}
			}

			case 'computer-modern': {
				return {
					bodyStyle: 'command-line',
					width: 'medium',
					font: 'monospace',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'computer-hacker-green': {
				return {
					bodyStyle: 'term-green',
					width: 'medium',
					font: 'monospace',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'computer-hacker-orange': {
				return {
					bodyStyle: 'term-orange',
					width: 'medium',
					font: 'monospace',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}

			case 'computer-c64': {
				return {
					bodyStyle: 'term-c64',
					width: 'medium',
					font: 'monospace',
					fontStyle: 'regular',
					lineHeight: 'regular',
					fontSize: 'regular',
					topEdge: 'normal',
					bottomEdge: 'normal'
				}
			}
		}
	}

	onChangePreset(event) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor,
			{
				content: {
					...this.props.element.content,
					...this.getPresetProps(event.target.value),
					preset: event.target.value
				}
			},
			{ at: path }
		)
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
					className={`text-chunk obojobo-draft--chunks--excerpt pad is-body-style-type-${content.bodyStyle} is-top-edge-type-${content.topEdge} is-bottom-edge-type-${content.bottomEdge} is-width-${content.width} is-font-${content.font} is-font-style-${content.fontStyle} is-line-height-type-${content.lineHeight} is-font-size-${content.fontSize}`}
				>
					<div>
						<div>
							<label>
								<span>Preset:</span>
							</label>
							<select value={content.preset} onChange={this.onChangePreset}>
								<option value="simple-filled">Simple Filled</option>
								<option value="simple-bordered">Simple Bordered</option>
								<option value="card">Card</option>
								<option value="fiction">Fiction</option>
								<option value="non-fiction">Non-fiction</option>
								<option value="historical">Historical</option>
								<option value="poem">Poem</option>
								<option value="white-paper">White Paper</option>
								<option value="instruction-manual">Instruction Manual</option>
								<option value="typewritten">Typewritten</option>
								<option value="receipt">Receipt</option>
								<option value="computer-modern">Command Line</option>
								<option value="computer-hacker-green">CRT Terminal (Green)</option>
								<option value="computer-hacker-orange">CRT Terminal (Orange)</option>
								<option value="computer-c64">Commodore 64 Screen</option>
								{/* <option value="modern-book-page">Modern Book Page</option>
								<option value="old-book-page">Older Book Page</option> */}
								<option value="none">None</option>
							</select>
						</div>
						<div>
							<label>
								<span>Style:</span>
							</label>
							<select value={content.bodyStyle} onChange={this.onChangeBodyStyle}>
								<option value="filled-box">Filled Box</option>
								<option value="bordered-box">Bordered Box</option>
								<option value="card">Card</option>
								<option value="white-paper">White Paper</option>
								<option value="modern-paper">Modern Paper</option>
								<option value="yellow-paper">Yellow Paper</option>
								<option value="x">x</option>
								<option value="aged-paper">Aged Paper</option>
								<option value="command-line">Command Line</option>
								<option value="term-green">CRT Terminal (Green)</option>
								<option value="term-orange">CRT Terminal (Orange)</option>
								<option value="term-c64">Commodore 64 Screen</option>
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
						<div>
							<label>
								<span>Font Style</span>
							</label>
							<select value={content.fontStyle} onChange={this.onChangeFontStyle}>
								<option value="regular">Regular</option>
								<option value="small-caps">Small Caps</option>
							</select>
						</div>
						<div>
							<label>
								<span>Line Height</span>
							</label>
							<select value={content.lineHeight} onChange={this.onChangeLineHeight}>
								<option value="compact">Compact</option>
								<option value="regular">Regular</option>
								<option value="generous">Generous</option>
							</select>
						</div>
						<div>
							<label>
								<span>Font Size</span>
							</label>
							<select value={content.fontSize} onChange={this.onChangeFontSize}>
								<option value="smaller">Smaller</option>
								<option value="regular">Regular</option>
								<option value="larger">Larger</option>
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
