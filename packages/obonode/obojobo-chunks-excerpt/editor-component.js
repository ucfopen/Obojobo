import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { findDOMNode } from 'react-dom'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import iconFontSizeSmall from './icon-font-size-small.svg'
import iconFontSizeMedium from './icon-font-size-medium.svg'
import iconFontSizeLarge from './icon-font-size-large.svg'
import iconLineHeightCompact from './icon-line-height-compact.svg'
import iconLineHeightModerate from './icon-line-height-moderate.svg'
import iconLineHeightGenerous from './icon-line-height-generous.svg'
import iconWidthLarge from './icon-width-large.svg'
import iconWidthMedium from './icon-width-medium.svg'
import iconWidthSmall from './icon-width-small.svg'
import iconWidthTiny from './icon-width-tiny.svg'
import Button from 'obojobo-document-engine/src/scripts/common/components/button'

const NO_EFFECT_DESCRIPTION = '(No effect available)'

const EdgeControls = ({ position, edges, selectedEdge, onChangeEdge, y, w }) => {
	if (edges.length === 0) {
		return null
	}

	const onMouseDown = (edgeType, event) => {
		event.preventDefault()

		onChangeEdge(edgeType)
	}

	const onChange = event => {
		event.preventDefault()

		onChangeEdge(event.target.value)
	}

	return (
		<div
			className={`obojobo-draft--chunks--excerpt--edge-controls is-position-${position}`}
			contentEditable={false}
			role="radiogroup"
			aria-label={`Select the edge display for the ${position} edge`}
			style={{ top: `${y}px`, width: `${w}px` }}
		>
			<div className="edges">
				{edges.map(e => (
					<label
						key={e}
						className={(selectedEdge === e ? 'is-selected' : 'is-not-selected') + ' is-edge-' + e}
						onMouseDown={onMouseDown.bind(null, e)}
					>
						<input
							type="radio"
							name={position}
							value={e}
							checked={selectedEdge === e}
							onChange={onChange}
						/>
						<span>{e}</span>
					</label>
				))}
			</div>
		</div>
	)
}

const RadioIcons = ({ name, options, selectedOption, ariaLabel, onChangeOption }) => {
	const onMouseDown = (option, event) => {
		event.preventDefault()

		onChangeOption(option)
	}

	const onChange = event => {
		event.preventDefault()

		onChangeOption(event.target.value)
	}

	return (
		<div className={`radio-icons`} role="radiogroup" aria-label={ariaLabel}>
			<div className="options">
				{options.map((o, i) => (
					<label
						key={o.label}
						className={
							(selectedOption === o.label ? 'is-selected' : 'is-not-selected') +
							' is-option-' +
							o.label
						}
						style={{ transform: `translate(${-i}px, 0)` }}
						onMouseDown={onMouseDown.bind(null, o.label)}
					>
						<input
							type="radio"
							name={name}
							value={o.label}
							checked={selectedOption === o.label}
							onChange={onChange}
						/>
						<span>{o.label}</span>
						{o.icon}
					</label>
				))}
			</div>
		</div>
	)
}

class Excerpt extends React.Component {
	constructor(props) {
		super(props)

		this.onChangePreset = this.onChangePreset.bind(this)
		this.onChangeBodyStyle = this.onChangeContent.bind(this, 'bodyStyle')
		this.onChangeTopEdge = this.onChangeContentValue.bind(this, 'topEdge')
		this.onChangeBottomEdge = this.onChangeContentValue.bind(this, 'bottomEdge')
		this.onChangeWidth = this.onChangeContentValue.bind(this, 'width')
		this.onChangeFont = this.onChangeContent.bind(this, 'font')
		this.onChangeFontStyle = this.onChangeContent.bind(this, 'fontStyle')
		this.onChangeLineHeight = this.onChangeContentValue.bind(this, 'lineHeight')
		this.onChangeFontSize = this.onChangeContentValue.bind(this, 'fontSize')
		this.onChangeEffect = this.onChangeContent.bind(this, 'effect')
		this.onClickMoreOptions = this.onClickMoreOptions.bind(this)

		this.boundOnViewerContentAreaResized = this.onViewerContentAreaResized.bind(this)

		this.ref = React.createRef()
		this.blockquoteRef = React.createRef()

		this.x = 0

		this.state = {
			isShowingMoreOptions: false,
			x: 0,
			y: 0,
			w: 0
		}
	}

	onClickMoreOptions() {
		this.setState({
			isShowingMoreOptions: !this.state.isShowingMoreOptions
		})
	}

	getPresetProps(presetName) {
		switch (presetName) {
			case 'minimal': {
				return {
					bodyStyle: 'none',
					width: 'medium',
					font: 'serif',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'excerpt': {
				return {
					bodyStyle: 'none',
					width: 'medium',
					font: 'palatino',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'simple-filled': {
				return {
					bodyStyle: 'filled-box',
					width: 'medium',
					font: 'sans',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'simple-bordered': {
				return {
					bodyStyle: 'bordered-box',
					width: 'medium',
					font: 'sans',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'card': {
				return {
					bodyStyle: 'card',
					width: 'medium',
					font: 'sans',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'fiction': {
				return {
					bodyStyle: 'light-yellow-paper',
					width: 'medium',
					font: 'palatino',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'non-fiction': {
				return {
					bodyStyle: 'modern-paper',
					width: 'medium',
					font: 'georgia',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'historical': {
				return {
					bodyStyle: 'dark-yellow-paper',
					width: 'medium',
					font: 'palatino',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'very-historical': {
				return {
					bodyStyle: 'aged-paper',
					width: 'medium',
					font: 'palatino',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'white-paper': {
				return {
					bodyStyle: 'white-paper',
					width: 'medium',
					font: 'times-new-roman',
					lineHeight: 'moderate',
					fontSize: 'regular',
					topEdge: 'normal',
					bottomEdge: 'fade',
					effect: false
				}
			}

			case 'instruction-manual': {
				return {
					bodyStyle: 'modern-paper',
					width: 'medium',
					font: 'helvetica',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'fade',
					effect: false
				}
			}

			case 'typewritten': {
				return {
					bodyStyle: 'white-paper',
					width: 'medium',
					font: 'courier',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'jagged',
					effect: false
				}
			}

			case 'receipt': {
				return {
					bodyStyle: 'white-paper',
					width: 'tiny',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'jagged',
					effect: false
				}
			}

			case 'computer-modern': {
				return {
					bodyStyle: 'command-line',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}

			case 'computer-hacker-white': {
				return {
					bodyStyle: 'term-white',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'computer-hacker-green': {
				return {
					bodyStyle: 'term-green',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'computer-hacker-orange': {
				return {
					bodyStyle: 'term-orange',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'modern-text-file': {
				return {
					bodyStyle: 'modern-text-file',
					width: 'medium',
					font: 'helvetica',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'retro-text-file': {
				return {
					bodyStyle: 'retro-text-file',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'generous',
					fontSize: 'smaller',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: true
				}
			}

			case 'computer-c64': {
				return {
					bodyStyle: 'term-c64',
					width: 'medium',
					font: 'monospace',
					lineHeight: 'moderate',
					fontSize: 'regular',
					topEdge: 'normal',
					bottomEdge: 'normal',
					effect: false
				}
			}
		}
	}

	getEdgeOptionsForBodyStyle(bodyStyle) {
		// <option value="none">None</option>
		// <option value="filled-box">Filled Box</option>
		// <option value="bordered-box">Bordered Box</option>
		// <option value="card">Card</option>

		// <option value="white-paper">White Paper</option>
		// <option value="modern-paper">Gray Paper</option>
		// <option value="light-yellow-paper">Light Yellow Paper</option>
		// <option value="dark-yellow-paper">Dark Yellow Paper</option>
		// <option value="aged-paper">Aged Paper</option>

		// <option value="retro-text-file">Retro Text File</option>
		// <option value="modern-text-file">Browser</option>
		// <option value="command-line">Command Line</option>
		// <option value="term-white">CRT Terminal (White)</option>
		// <option value="term-green">CRT Terminal (Green)</option>
		// <option value="term-orange">CRT Terminal (Orange)</option>
		// <option value="term-c64">Commodore 64 Screen</option>

		switch (bodyStyle) {
			case 'none':
				return []

			case 'filled-box':
			case 'bordered-box':
			case 'card':
			case 'white-paper':
			case 'modern-paper':
			case 'light-yellow-paper':
			case 'dark-yellow-paper':
			case 'aged-paper':
				return ['normal', 'fade', 'jagged']

			default:
				return ['normal', 'fade']
		}
	}

	isEffectAvailable(bodyStyle) {
		return this.getEffectDescription(bodyStyle) !== NO_EFFECT_DESCRIPTION
	}

	getEffectDescription(bodyStyle) {
		switch (bodyStyle) {
			case 'white-paper':
			case 'modern-paper':
			case 'light-yellow-paper':
			case 'dark-yellow-paper':
			case 'aged-paper':
				return 'Paper background'

			case 'term-white':
			case 'term-orange':
			case 'term-green':
				return 'Screen / glow effects'

			case 'modern-text-file':
			case 'retro-text-file':
				return 'Drop shadow'

			default:
				return NO_EFFECT_DESCRIPTION
		}
	}

	onChangePreset(presetValue) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor,
			{
				content: {
					...this.props.element.content,
					...this.getPresetProps(presetValue),
					preset: presetValue
				}
			},
			{ at: path }
		)
	}

	onChangeContent(contentValueName, event) {
		console.log('onChangeContent', contentValueName, event.target.value)
		this.onChangeContentValue(contentValueName, event.target.value)
	}

	onChangeContentValue(contentValueName, value) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, [contentValueName]: value } },
			{ at: path }
		)

		setTimeout(() => {
			this.onViewerContentAreaResized()
		})
	}

	componentDidMount() {
		window.addEventListener('resize', event => {})

		if (
			window.ResizeObserver &&
			window.ResizeObserver.prototype &&
			window.ResizeObserver.prototype.observe &&
			window.ResizeObserver.prototype.disconnect
		) {
			this.resizeObserver = new ResizeObserver(this.boundOnViewerContentAreaResized)
			this.resizeObserver.observe(
				findDOMNode(this.blockquoteRef.current).getElementsByClassName('wrapper')[0]
			)
		}
	}

	componentWillUnmount() {
		if (this.resizeObserver) this.resizeObserver.disconnect()
	}

	onViewerContentAreaResized() {
		console.log(this.getMeasuredDimensions())
		this.setState(this.getMeasuredDimensions())
	}

	getMeasuredDimensions() {
		const el = this.ref.current

		const wrapper = el.getElementsByClassName('wrapper')[0]
		const excerptContent = el.getElementsByClassName('excerpt-content')[0]

		const elBbox = el.getBoundingClientRect()
		const wrapperBbox = wrapper.getBoundingClientRect()
		const excerptContentBbox = excerptContent.getBoundingClientRect()

		this.x = elBbox.left - wrapperBbox.left
		this.x = wrapperBbox.left

		return {
			x: wrapperBbox.left - elBbox.left,
			y: excerptContentBbox.height,
			w: excerptContentBbox.width
		}
	}

	render() {
		const content = this.props.element.content

		const presets = [
			{
				label: 'Minimal',
				value: 'minimal'
			},
			{
				label: 'Excerpt',
				value: 'excerpt'
			},
			{
				label: 'Simple Filled',
				value: 'simple-filled'
			},
			{
				label: 'Simple Bordered',
				value: 'simple-bordered'
			},
			{
				label: 'Card',
				value: 'card'
			},
			{
				label: 'Fiction',
				value: 'fiction'
			},
			{
				label: 'Non-Fiction',
				value: 'non-fiction'
			},
			{
				label: 'Historical',
				value: 'historical'
			},
			{
				label: 'Very Historical',
				value: 'very-historical'
			},
			{
				label: 'White Paper',
				value: 'white-paper'
			},
			{
				label: 'Inst. Manual',
				value: 'instruction-manual'
			},
			{
				label: 'Typewritten',
				value: 'typewritten'
			},
			{
				label: 'Receipt',
				value: 'receipt'
			},
			{
				label: 'Site / Doc',
				value: 'modern-text-file'
			},
			{
				label: 'Retro Text File',
				value: 'retro-text-file'
			},
			{
				label: 'Command Line',
				value: 'computer-modern'
			},
			{
				label: 'Hacker Green',
				value: 'computer-hacker-green'
			},
			{
				label: 'Hacker Orange',
				value: 'computer-hacker-orange'
			}
		]

		const edgeOptions = this.getEdgeOptionsForBodyStyle(content.bodyStyle)
		const isEffectAvailable = this.isEffectAvailable(content.bodyStyle)

		console.log('@TODO: Make sure these css class names wont bleed')
		console.log('@TODO: when excerpt is the last item the menu obscures the (+) button')
		console.log('@TODO: you can delete citations')
		console.log('@TODO: over time multiple cite lines are created')
		console.log('@TODO: changing a line to a heading makes nested excerpts')
		console.log('@TODO: glow text leaks into the caption')
		console.log('@TODO: hitting enter too quickly results in a crash')
		console.log('@TODO: preview is disabled')
		return (
			<Node {...this.props}>
				<div
					ref={this.ref}
					className={`text-chunk obojobo-draft--chunks--excerpt pad ${
						this.props.selected ? 'is-selected' : 'is-not-selected'
					} ${
						this.state.isShowingMoreOptions
							? 'is-showing-more-options'
							: 'is-not-showing-more-options'
					} is-body-style-type-${content.bodyStyle} is-top-edge-type-${
						content.topEdge
					} is-bottom-edge-type-${content.bottomEdge} is-width-${content.width} is-font-${
						content.font
					} is-font-style-${content.fontStyle} is-line-height-type-${
						content.lineHeight
					} is-font-size-${content.fontSize} ${
						content.effect ? 'is-showing-effect' : 'is-not-showing-effect'
					}`}
				>
					<blockquote ref={this.blockquoteRef}>
						{this.props.children}
						{this.props.selected ? (
							<div
								style={{ position: 'absolute', left: `${this.state.x}px` }}
								contentEditable={false}
								className="attributes-box"
								onMouseDown={event => {
									console.log('event', event.target, event.target.tagName)
									switch (event.target.tagName) {
										case 'INPUT':
										case 'SELECT':
											return

										default:
											event.preventDefault()
									}

									// alert('click')
									// event.stopPropagation()
								}}
							>
								<div className="attributes-list">
									<div>
										{this.state.isShowingMoreOptions ? null : (
											<ul className="preset-list">
												{presets.map(p => {
													return (
														<li
															key={p.value}
															className={
																content.preset === p.value ? 'is-selected' : 'is-not-selected'
															}
														>
															<button onClick={this.onChangePreset.bind(this, p.value)}>
																<div className={`icon icon-${p.value}`}></div>
																<span>{p.label}</span>
															</button>
														</li>
													)
												})}
											</ul>
										)}
									</div>

									{this.state.isShowingMoreOptions ? (
										<div className="more-options">
											<div>
												<label className="attribute-label">
													<span>Style</span>
												</label>
												<select value={content.bodyStyle} onChange={this.onChangeBodyStyle}>
													<optgroup label="Simple">
														<option value="none">None</option>
														<option value="filled-box">Filled Box</option>
														<option value="bordered-box">Bordered Box</option>
														<option value="card">Card</option>
													</optgroup>
													<optgroup label="Paper">
														<option value="white-paper">White Paper</option>
														<option value="modern-paper">Gray Paper</option>
														<option value="light-yellow-paper">Light Yellow Paper</option>
														<option value="dark-yellow-paper">Dark Yellow Paper</option>
														<option value="aged-paper">Aged Paper</option>
													</optgroup>
													<optgroup label="Computer">
														<option value="modern-text-file">Browser</option>
														<option value="retro-text-file">Retro Text File</option>
														<option value="command-line">Command Line</option>
														<option value="term-white">CRT Terminal (White)</option>
														<option value="term-green">CRT Terminal (Green)</option>
														<option value="term-orange">CRT Terminal (Orange)</option>
														<option value="term-c64">Commodore 64 Screen</option>
													</optgroup>
												</select>
											</div>

											<div>
												<label className="attribute-label">
													<span>Font</span>
												</label>
												<select value={content.font} onChange={this.onChangeFont}>
													<optgroup label="Obojobo Default Fonts">
														<option value="serif">Serif</option>
														<option value="sans">Sans-Serif</option>
														<option value="monospace">Monospace</option>
													</optgroup>
													<optgroup label="System Fonts">
														<option value="times-new-roman">Times New Roman</option>
														<option value="georgia">Georgia</option>
														<option value="helvetica">Helvetica</option>
														<option value="courier">Courier</option>
														<option value="palatino">Palatino</option>
													</optgroup>
												</select>
											</div>

											<div>
												<label className="attribute-label">
													<span>Width</span>
												</label>
												<RadioIcons
													name="width"
													ariaLabel="blah"
													options={[
														{ label: 'large', icon: <img src={iconWidthLarge} /> },
														{ label: 'medium', icon: <img src={iconWidthMedium} /> },
														{ label: 'small', icon: <img src={iconWidthSmall} /> },
														{ label: 'tiny', icon: <img src={iconWidthTiny} /> }
													]}
													selectedOption={content.width}
													onChangeOption={this.onChangeWidth}
												/>
											</div>

											<div>
												<label className="attribute-label">
													<span>Font Size</span>
												</label>
												<RadioIcons
													name="font-size"
													ariaLabel="blah"
													options={[
														{ label: 'smaller', icon: <img src={iconFontSizeSmall} /> },
														{ label: 'regular', icon: <img src={iconFontSizeMedium} /> },
														{ label: 'larger', icon: <img src={iconFontSizeLarge} /> }
													]}
													selectedOption={content.fontSize}
													onChangeOption={this.onChangeFontSize}
												/>
											</div>
											<div>
												<label className="attribute-label">
													<span>Line Height</span>
												</label>
												<RadioIcons
													name="line-height"
													ariaLabel="blah"
													options={[
														{ label: 'compact', icon: <img src={iconLineHeightCompact} /> },
														{ label: 'moderate', icon: <img src={iconLineHeightModerate} /> },
														{ label: 'generous', icon: <img src={iconLineHeightGenerous} /> }
													]}
													selectedOption={content.lineHeight}
													onChangeOption={this.onChangeLineHeight}
												/>
											</div>
											<div>
												<label
													className={`effect-settings ${
														isEffectAvailable ? 'is-enabled' : 'is-not-enabled'
													}`}
												>
													<input
														disabled={!isEffectAvailable}
														type="checkbox"
														checked={content.effect}
														onChange={event => {
															console.log('CHECKBOX', content, event.target.checked)
															this.onChangeContentValue('effect', event.target.checked)
														}}
													/>
													<span>{this.getEffectDescription(content.bodyStyle)}</span>
												</label>
											</div>
										</div>
									) : null}
								</div>
								<Button altAction onClick={this.onClickMoreOptions}>
									{this.state.isShowingMoreOptions
										? 'Exit advanced options'
										: 'Advanced options...'}
								</Button>
							</div>
						) : null}
						<EdgeControls
							position="top"
							y={0}
							w={this.state.w}
							edges={edgeOptions}
							selectedEdge={content.topEdge}
							onChangeEdge={this.onChangeTopEdge}
						/>

						<EdgeControls
							position="bottom"
							y={this.state.y}
							w={this.state.w}
							edges={edgeOptions}
							selectedEdge={content.bottomEdge}
							onChangeEdge={this.onChangeBottomEdge}
						/>
					</blockquote>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Excerpt)
